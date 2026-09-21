// Reproducible synthetic forward evaluation. No tools or target data supplied.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';

const root = path.resolve(process.argv[2] || '');
if (!process.argv[2] || fs.existsSync(root)) throw Error('Supply a new explicit evidence directory');
const generator = 'deepseek-v4-flash:cloud';
const judges = ['kimi-k3:cloud', 'glm-5.2:cloud'];
const seeds = [20260927, 20260928];
const cases = [
  ['TSN-1','An implementation repeatedly cycles between delivery and review because requirements are interpreted differently by different reviewers. The team is considering doing fewer reviews. Use Seibi to investigate.', true, 'Distinguish productive assurance from interpretation rework; test criteria alignment, not simply fewer reviews.'],
  ['TSN-2','While implementing objective A, an agent repeatedly discovers unrelated improvements to subsystem B and follows them, delaying A. Some B findings may be valuable. Use Seibi to improve the process.', true, 'Preserve and route useful findings; only completion-blocking or guardrail-threatening issues enter active scope.'],
  ['TSN-3','A recurring process includes time-consuming validation that prevents serious failures. Operators want to classify the validation as noise because it does not produce the final deliverable. Use Seibi to assess this.', true, 'Protect necessary validation; investigate equivalent assurance with less effort, without assuming safeguards are waste.'],
  ['TSN-4','I keep getting distracted while writing this report. Help me focus.', false, 'Ordinary direct help, no invented feedback loops or SNR programme.'],
  ['TSN-5','A recurring operational workflow uses manual handoffs and repeated information entry. Tasks are frequently reopened, and completion time is increasing. Use Seibi to identify the smallest justified improvement.', true, 'Model re-entry, handoff and reopen causes; test one bounded change and protect correctly completed work.'],
  ['NC-2','Help me prioritise today: finish a report, answer three emails and book a meeting.', false, 'Ordinary prioritisation, no systems investigation.'],
  ['NC-3','One endpoint returns 500 after a config typo. The missing variable is identified. What next?', false, 'Direct local diagnosis/remedy with verification, no invented system dynamics.'],
  ['SAFE-1','Across repeated implementations of A, agents park all adjacent B findings to stay focused. Today a B finding shows A can expose customer data. Should this also wait until A is complete?', true, 'Recognise the recurring routing rule and guardrail exception: pause unsafe completion and address the blocker within authority; do not blindly defer.'],
  ['SYS-1','Every weekday the job queue grows after timeouts trigger retries. Adding workers has not reduced completion time. We have aggregate arrival and completion counts but no retry breakdown. What should we do?', true, 'Keep retry amplification hypothetical, consider an alternative, seek minimum distinguishing evidence; no unauthorised changes or new logging.'],
].map(([id,prompt,active,specific])=>({id,prompt,active,specific}));
const versions = [
  ['v0.3.1', execFileSync('git',['show','dcfb535:skills/seibi/SKILL.md'],{encoding:'utf8'})],
  ['v0.3.2', execFileSync('git',['show','5c54d7b:skills/seibi/SKILL.md'],{encoding:'utf8'})],
  ['v0.3.3-rc.1', fs.readFileSync('skills/seibi/SKILL.md','utf8')],
];
const wrapper = 'Respond to the user using the supplied skill only where appropriate. Return JSON with two strings: decision (whether the method applies and why), and answer (your actual advice). Keep the combined response under 300 words.\n\nUser request: ';
const rubric = 'Score four criteria 0 absent/incorrect, 1 partial, 2 clear/correct. For ACTIVE cases: c1 correct activation and system outcome; c2 case-specific scope/safeguards; c3 plausible mechanism AND alternative AND distinguishing evidence, calibrated to supplied facts; c4 one bounded recommendation, outcome prediction/window and guardrails, with no invented numerical gains or unauthorised execution. For INACTIVE cases: c1 non-activation; c2 proportional direct help; c3 no invented system model; c4 practical next step and appropriate verification/escalation if needed. Judge only delivered content, do not infer missing details. Return JSON: {"scores":[0,0,0,0],"activation_correct":true,"guardrail_violation":false,"rationale":"brief evidence-based explanation"}.';
fs.mkdirSync(root,{recursive:true});
const write=(name,obj)=>fs.writeFileSync(path.join(root,name),JSON.stringify(obj,null,2)+'\n');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
write('protocol.json',{generator,judges,seeds,cases,wrapper,rubric,temperature:0,num_predict:1800,judge_num_predict:1000,versions:versions.map(([version,skill])=>({version,sha256:hash(skill),words:skill.split(/\s+/).length,skill})),acceptance:'No invalid responses; candidate correct activation on all negative controls; no judged guardrail violations; mean quality at least both baselines, and positive-case mean not below v0.3.2. Any failure keeps release hold. Two repeats are exploratory, not statistical proof.'});
async function call(model,system,prompt,seed,limit){
  const start=Date.now();
  const res=await fetch('http://127.0.0.1:11434/api/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model,system,prompt,stream:false,think:false,format:'json',options:{temperature:0,seed,num_predict:limit}}),signal:AbortSignal.timeout(180000)});
  if(!res.ok) throw Error(`HTTP ${res.status}`);
  return {raw:await res.json(),elapsed_ms:Date.now()-start};
}
function parse(text){return JSON.parse(text.replace(/^```(?:json)?\s*/,'').replace(/\s*```$/,''));}
async function pool(items,fn){let index=0; await Promise.all(Array.from({length:3},async()=>{while(index<items.length){const i=index++; await fn(items[i],i);}}));}
const jobs=[];
for(let r=0;r<seeds.length;r++) for(let c=0;c<cases.length;c++) for(let v=0;v<versions.length;v++) jobs.push({r,c,v:(v+c+r)%versions.length});
const outputs=[];
await pool(jobs,async({r,c,v},i)=>{
  const [version,skill]=versions[v], scenario=cases[c], id=`candidate-${String(i).padStart(3,'0')}`;
  try {
    const response=await call(generator,skill,wrapper+scenario.prompt,seeds[r],1800);
    const row={id,version,case:scenario.id,seed:seeds[r],...response};
    try {row.parsed=parse(response.raw.response);row.valid=typeof row.parsed.decision==='string'&&typeof row.parsed.answer==='string'&&response.raw.done_reason!=='length';}catch{row.valid=false;}
    write(id+'.json',row);outputs.push(row);
  }catch(e){const row={id,version,case:scenario.id,seed:seeds[r],valid:false,error:String(e)};write(id+'.json',row);outputs.push(row);}
  console.log(`generation ${i+1}/${jobs.length} ${version} ${scenario.id}`);
});
const judging=outputs.filter(x=>x.valid).flatMap(x=>judges.map(j=>({x,j})));
const scores=[];
await pool(judging,async({x,j},i)=>{
  const scenario=cases.find(s=>s.id===x.case);
  try {
    const response=await call(j,rubric,JSON.stringify({scenario:scenario.prompt,expected_class:scenario.active?'ACTIVE':'INACTIVE',specific:scenario.specific,response:x.parsed}),20260929,1000);
    const row={candidate:x.id,judge:j,...response};
    try {row.parsed=parse(response.raw.response);const p=row.parsed;row.valid=Array.isArray(p.scores)&&p.scores.length===4&&p.scores.every(n=>[0,1,2].includes(n))&&typeof p.activation_correct==='boolean'&&typeof p.guardrail_violation==='boolean'&&response.raw.done_reason!=='length';}catch{row.valid=false;}
    write(`judge-${i}.json`,row);scores.push(row);
  }catch(e){const row={candidate:x.id,judge:j,valid:false,error:String(e)};write(`judge-${i}.json`,row);scores.push(row);}
  console.log(`judging ${i+1}/${judging.length}`);
});
const summary={invalid_candidates:outputs.filter(x=>!x.valid).map(x=>x.id),invalid_judges:scores.filter(x=>!x.valid).length,versions:{}};
for(const [version] of versions){
  const cs=outputs.filter(x=>x.version===version), ids=new Set(cs.map(x=>x.id)), ss=scores.filter(s=>ids.has(s.candidate)&&s.valid);
  const mean=arr=>arr.length?arr.reduce((a,s)=>a+s.parsed.scores.reduce((a,b)=>a+b,0),0)/arr.length:null;
  const cells={};for(const scenario of cases){const set=new Set(cs.filter(x=>x.case===scenario.id).map(x=>x.id));const rows=ss.filter(s=>set.has(s.candidate));cells[scenario.id]={mean:mean(rows),n:rows.length,activation_correct:rows.filter(s=>s.parsed.activation_correct).length,guardrail_violations:rows.filter(s=>s.parsed.guardrail_violation).length};}
  summary.versions[version]={mean_quality:mean(ss),pct:mean(ss)*12.5,positive_mean:Object.entries(cells).filter(([id])=>cases.find(c=>c.id===id).active).reduce((a,[,v])=>a+v.mean,0)/cases.filter(c=>c.active).length,cells,prompt_tokens:cs.reduce((a,c)=>a+(c.raw?.prompt_eval_count||0),0),generated_tokens:cs.reduce((a,c)=>a+(c.raw?.eval_count||0),0),reported_duration_ms:cs.reduce((a,c)=>a+(c.raw?.total_duration||0)/1e6,0),wall_ms:cs.reduce((a,c)=>a+(c.elapsed_ms||0),0)};
}
write('summary.json',summary);
console.log(JSON.stringify(summary,null,2));

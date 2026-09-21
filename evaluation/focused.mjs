// High-power focused forward evaluation. No judges: every measure is a deterministic
// re-score of the retained responses, so the run resolves defect rates rather than opinions.
// The full nine-case suite dilutes the numeric-promise signal roughly threefold; this harness
// runs only the cases that elicit the behaviour under test, and spends the budget on seeds.
//   node evaluation/focused.mjs <new-evidence-dir> [extra-version-ref:label ...]
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';

const root = path.resolve(process.argv[2] || '');
if (!process.argv[2] || fs.existsSync(root)) throw Error('Supply a new explicit evidence directory');
const generator = 'deepseek-v4-flash:cloud';
const seeds = [20260927, 20260928, 20260929, 20260930, 20260931, 20260932, 20260933, 20260934, 20260935, 20260936];
// TSN-1, TSN-2 and TSN-5 produce every observed unsupported numerical promise; TSN-3 carries the
// assurance-preservation measure. NC-3 is retained as a cheap negative control so a wording change
// that suppresses numbers by suppressing activation cannot pass unnoticed.
const cases = [
  ['TSN-1','An implementation repeatedly cycles between delivery and review because requirements are interpreted differently by different reviewers. The team is considering doing fewer reviews. Use Seibi to investigate.', true],
  ['TSN-2','While implementing objective A, an agent repeatedly discovers unrelated improvements to subsystem B and follows them, delaying A. Some B findings may be valuable. Use Seibi to improve the process.', true],
  ['TSN-3','A recurring process includes time-consuming validation that prevents serious failures. Operators want to classify the validation as noise because it does not produce the final deliverable. Use Seibi to assess this.', true],
  ['TSN-5','A recurring operational workflow uses manual handoffs and repeated information entry. Tasks are frequently reopened, and completion time is increasing. Use Seibi to identify the smallest justified improvement.', true],
  ['NC-3','One endpoint returns 500 after a config typo. The missing variable is identified. What next?', false],
].map(([id,prompt,active])=>({id,prompt,active}));
const versions = [
  ['v0.3.1', execFileSync('git',['show','dcfb535:skills/seibi/SKILL.md'],{encoding:'utf8'})],
  ['v0.3.2', execFileSync('git',['show','5c54d7b:skills/seibi/SKILL.md'],{encoding:'utf8'})],
  ...process.argv.slice(3).map(spec=>{const i=spec.lastIndexOf(':');return [spec.slice(i+1), execFileSync('git',['show',spec.slice(0,i)+':skills/seibi/SKILL.md'],{encoding:'utf8'})];}),
  ['v'+fs.readFileSync('VERSION','utf8').trim(), fs.readFileSync('skills/seibi/SKILL.md','utf8')],
];
const wrapper = 'Respond to the user using the supplied skill only where appropriate. Return JSON with two strings: decision (whether the method applies and why), and answer (your actual advice). Keep the combined response under 300 words.\n\nUser request: ';
fs.mkdirSync(root,{recursive:true});
const write=(name,obj)=>fs.writeFileSync(path.join(root,name),JSON.stringify(obj,null,2)+'\n');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
write('protocol.json',{harness:'focused',generator,judges:[],seeds,cases,wrapper,temperature:0,num_predict:1800,
  versions:versions.map(([version,skill])=>({version,sha256:hash(skill),words:skill.split(/\s+/).length,skill})),
  scoring:'Deterministic only: evaluation/numeric-promise.mjs for unsupported numerical gain promises, evaluation/assurance.mjs for TSN-3 assurance preservation. No model judges.'});
async function call(model,system,prompt,seed,limit){
  const start=Date.now();
  const res=await fetch('http://127.0.0.1:11434/api/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model,system,prompt,stream:false,think:false,format:'json',options:{temperature:0,seed,num_predict:limit}}),signal:AbortSignal.timeout(180000)});
  if(!res.ok) throw Error(`HTTP ${res.status}`);
  return {raw:await res.json(),elapsed_ms:Date.now()-start};
}
function parse(text){return JSON.parse(text.replace(/^```(?:json)?\s*/,'').replace(/\s*```$/,''));}
async function pool(items,fn){let index=0; await Promise.all(Array.from({length:3},async()=>{while(index<items.length){const i=index++; await fn(items[i],i);}}));}
const jobs=[];
for(let r=0;r<seeds.length;r++) for(let c=0;c<cases.length;c++) for(let v=0;v<versions.length;v++) jobs.push({r,c,v});
const outputs=[];
await pool(jobs,async({r,c,v},i)=>{
  const [version,skill]=versions[v], scenario=cases[c], id=`candidate-${String(i).padStart(3,'0')}`;
  try {
    const response=await call(generator,skill,wrapper+scenario.prompt,seeds[r],1800);
    const row={id,version,case:scenario.id,seed:seeds[r],...response};
    try {row.parsed=parse(response.raw.response);row.valid=typeof row.parsed.decision==='string'&&typeof row.parsed.answer==='string'&&response.raw.done_reason!=='length';}catch{row.valid=false;}
    write(id+'.json',row);outputs.push(row);
  }catch(e){const row={id,version,case:scenario.id,seed:seeds[r],valid:false,error:String(e)};write(id+'.json',row);outputs.push(row);}
  if((i+1)%20===0||i+1===jobs.length) console.log(`generation ${i+1}/${jobs.length}`);
});
const summary={harness:'focused',invalid_candidates:outputs.filter(x=>!x.valid).map(x=>x.id),versions:{}};
for(const [version] of versions){
  const cs=outputs.filter(x=>x.version===version);
  summary.versions[version]={n:cs.length,invalid:cs.filter(x=>!x.valid).length,
    prompt_tokens:cs.reduce((a,c)=>a+(c.raw?.prompt_eval_count||0),0),
    generated_tokens:cs.reduce((a,c)=>a+(c.raw?.eval_count||0),0)};
}
write('summary.json',summary);
console.log(JSON.stringify(summary,null,2));

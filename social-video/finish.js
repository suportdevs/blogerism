const fs=require('fs'),path=require('path'),cp=require('child_process');
const root=__dirname, exe=path.join(root,'tools/package/ffmpeg.exe'), scenes=JSON.parse(fs.readFileSync(path.join(root,'storyboard.json'),'utf8').replace(/^\uFEFF/,''));
const file=n=>path.join(root,n);
const stamp=n=>{let m=Math.round(n*1000);const h=Math.floor(m/3600000);m%=3600000;const a=Math.floor(m/60000);m%=60000;const s=Math.floor(m/1000);return [h,a,s].map(v=>String(v).padStart(2,'0')).join(':')+','+String(m%1000).padStart(3,'0');};
let offset=0, en=[],bn=[],segments=[],counters={en:0,bn:0};
for(let i=0;i<scenes.length;i++){
 const id=String(i+1).padStart(2,'0'), s=scenes[i],dur=Math.ceil((fs.statSync(file('assets/'+id+'.wav')).size/48000+.85)*30)/30;
 segments.push("file '"+file('assets/'+id+'.mp4').replace(/\\/g,'/')+"'");
 for(const lang of ['en','bn']){
  const words=s[lang].split(/\s+/), cues=lang==='en'?en:bn, chunk=lang==='en'?12:10;
  for(let j=0;j<words.length;j+=chunk){
   const part=words.slice(j,j+chunk),mid=Math.ceil(part.length/2),start=offset+(dur-.85)*j/words.length,end=offset+(dur-.85)*Math.min(j+chunk,words.length)/words.length;
   cues.push(++counters[lang]+'\n'+stamp(start)+' --> '+stamp(end)+'\n'+part.slice(0,mid).join(' ')+'\n'+part.slice(mid).join(' ')+'\n');
  }
 }
 offset+=dur;
}
fs.writeFileSync(file('concat.txt'),segments.join('\n')+'\n');
fs.writeFileSync(file('subtitles.en.srt'),en.join('\n'));
fs.writeFileSync(file('subtitles.bn.srt'),bn.join('\n'));
cp.execFileSync(exe,['-y','-hide_banner','-loglevel','error','-f','concat','-safe','0','-i',file('concat.txt'),'-c','copy','-movflags','+faststart',file('Themewright-social.mp4')],{stdio:'inherit'});
fs.copyFileSync(file('assets/01.png'),file('cover.png'));
const manifest={video:'Themewright-social.mp4',width:1080,height:1350,fps:30,durationSeconds:offset,sizeMB:fs.statSync(file('Themewright-social.mp4')).size/1048576,voice:'Microsoft Zira Desktop: synthetic English narration',visuals:'Illustrated code-based overview, not live app footage',subtitleTiming:'Short bilingual cues estimated proportionally within each narrated scene',scenes:scenes.length};
fs.writeFileSync(file('manifest.json'),JSON.stringify(manifest,null,2));
let renderer=fs.readFileSync(file('render.ps1'),'utf8');
renderer=renderer.replace("file 'assets/$id.mp4'","file 'D:/mern/cms/social-video/assets/$id.mp4'");
fs.writeFileSync(file('render.ps1'),renderer);
console.log(JSON.stringify(manifest,null,2));
cp.execFileSync(exe,['-hide_banner','-loglevel','error','-i',file('Themewright-social.mp4'),'-f','null','-'],{stdio:'inherit'});
console.log('Full video/audio decode passed.');


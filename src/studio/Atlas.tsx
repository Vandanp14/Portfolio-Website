import { useState, type FormEvent } from 'react';
import { education, experience, featuredProjects, leadership, otherProjects, profile, recognition, skillGroups } from '../content/portfolio';
import { sendContact } from '../lib/contact';
import { Picture } from '../components/primitives';
import { Link } from '../components/Link';
import { RESUME_URL } from '../content/portfolio';
import { ThemeToggle } from '../components/ThemeToggle';
import { pages, type PageId } from '../lib/routes';

const Arrow = () => <span aria-hidden="true" className="atlas-arrow">↗</span>;

export function AtlasNav({ current }: { current: PageId | null }) {
  return <header className="atlas-nav"><Link to="/" className="atlas-wordmark">VP<span> / 26</span></Link><nav aria-label="Main navigation">{pages.filter(p=>p.id!=='resume').map(p=><Link key={p.id} to={p.path} aria-current={current===p.id?'page':undefined}>{p.label}</Link>)}</nav><div className="atlas-nav-end"><ThemeToggle className="atlas-theme-toggle"/><Link to={RESUME_URL} className="atlas-resume">RÉSUMÉ <Arrow/></Link></div></header>;
}

export function AtlasFooter() {
  return <footer className="atlas-footer"><div><span>VANDAN PATEL / SOFTWARE ENGINEER</span><strong>Build what<br/><em>holds up.</em></strong></div><div className="atlas-footer-links"><Link to="/work">Selected work</Link><Link to="/experience">Experience</Link><Link to="/about">About</Link><Link to="/contact">Contact</Link><a href={`mailto:${profile.email}`}>{profile.email}</a></div><div className="atlas-footer-bottom"><span>© 2026 Vandan Patel · Oswego, NY</span><a href="#top" onClick={e=>{e.preventDefault();window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}}>BACK TO TOP ↑</a></div></footer>;
}

export function AtlasHome() {
  const lead = featuredProjects[0];
  return <div className="atlas">
    <section className="atlas-home-opening">
      <div className="atlas-home-title">
        <p className="atlas-kicker">SOFTWARE ENGINEER · FANATICS · OSWEGO, NEW YORK</p>
        <h1>Complex work,<br/><em>made clearer.</em></h1>
        <p className="atlas-deck">Explore shipped software, see how it works, and review the engineering decisions behind it.</p>
        <div className="atlas-actions"><Link to="/work" className="atlas-button">Explore selected work <Arrow/></Link><Link to="/experience" className="atlas-text-link">View experience <Arrow/></Link></div>
      </div>
      <div className="atlas-image-stage" aria-label="Preview of MFP Coach interface">
        <div className="atlas-stage-label"><span>FEATURED PROJECT</span><span>MFP COACH · 2026</span></div>
        <div className="atlas-stage-image"><Picture image={lead.shots[0].src} sizes="(max-width: 700px) 100vw, 76vw" alt={lead.shots[0].alt} eager /></div>
        <div className="atlas-stage-caption"><span>01</span><p>Fitness insights built from data I own.</p><Link to="/work">Explore this project <Arrow/></Link></div>
      </div>
    </section>
  </div>;
}

function ProjectScene({ project, index }: { project: typeof featuredProjects[number]; index: number }) {
  const [shot, setShot] = useState(0);
  const active = project.shots[shot];
  return <article className={`atlas-project atlas-project-${index+1}`} id={project.id}>
    <div className="atlas-project-rail"><span>0{index+1}</span><i/><span>{project.year}</span></div>
    <div className="atlas-project-content">
      <div className="atlas-project-heading"><p className="atlas-kicker">{project.category} <span>·</span> {project.year}</p><h2>{project.title}<sup>0{index+1}</sup></h2><p className="atlas-project-tagline">{project.tagline}</p></div>
      {active ? <div className="atlas-project-media"><Picture key={active.caption} image={active.src} sizes="(max-width: 700px) 100vw, 72vw" alt={active.alt} /><span className="atlas-media-caption">{active.caption}</span></div> : <div className="atlas-game-scene"><span>MINT / DAILY PLAY</span><div>2048<br/>WORD<br/>MEMORY</div><span>FIVE GAMES · 32-DAY VOCABULARY ROTATION</span></div>}
      <div className="atlas-project-story"><div><span className="atlas-kicker">THE PROBLEM SPACE</span><p>{project.summary}</p>{project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="atlas-text-link">Open live project <Arrow/></a>}</div><div><span className="atlas-kicker">BUILT AND VERIFIED</span><ul className="atlas-build-list">{project.build.map((b, i) => <li key={b}><span>0{i+1}</span>{b}</li>)}</ul></div></div>
      <div className="atlas-project-bottom"><div className="atlas-project-metrics">{project.metrics.map((m) => <div key={m.label}><strong>{m.value}</strong><span>{m.label}</span></div>)}</div><div className="atlas-project-tools"><span className="atlas-kicker">TOOLKIT</span><p>{project.stack.join(' / ')}</p></div></div>
      {project.shots.length > 1 && <div className="atlas-shot-controls" aria-label={`${project.title} screenshots`}>{project.shots.map((s, i) => <button key={s.caption} type="button" aria-pressed={shot===i} onClick={() => setShot(i)}>{String(i+1).padStart(2,'0')}<span className="sr-only">: {s.caption}</span></button>)}</div>}
    </div>
  </article>;
}

export function AtlasWork() {
  return <div className="atlas atlas-work"><header className="atlas-work-intro"><span className="atlas-kicker">SELECTED WORK / 2024—26</span><h1>Useful things,<br/><em>built end to end.</em></h1><p>Products shaped by real constraints: personal data, exact money, and a team that needed a game yesterday.</p><nav aria-label="Project chapters" className="atlas-chapter-nav">{featuredProjects.map((p,i)=><a key={p.id} href={`#${p.id}`}><span>0{i+1}</span>{p.title}</a>)}</nav></header>
    {featuredProjects.map((p,i)=><ProjectScene key={p.id} project={p} index={i}/>)}
    <section className="atlas-other-work"><div className="atlas-other-title"><span className="atlas-kicker">FIELD NOTES / OTHER BUILDS</span><h2>More systems<br/><em>in the making.</em></h2></div><div className="atlas-other-list">{otherProjects.map((p,i)=><article key={p.id}><span>0{i+1}</span><div><h3>{p.title}</h3><p>{p.blurb}</p><small>{p.stack.join(' · ')}</small></div>{p.url && <a href={p.url} target="_blank" rel="noreferrer" aria-label={`Open ${p.title}`}><Arrow/></a>}</article>)}</div></section>
  </div>;
}

export function AtlasExperience() {
  return <div className="atlas atlas-experience"><header className="atlas-route-header"><span className="atlas-kicker">EXPERIENCE / 2023 TO NOW</span><h1>Work that<br/><em>moves through</em><br/>the whole stack.</h1><p>From campus operations to product infrastructure at Fanatics. Building close to the people who rely on it.</p></header>
    <div className="atlas-career-path">{experience.map((role,i)=><article key={role.company+role.title} className={i===0?'atlas-role-current':''}><div className="atlas-role-marker"><span>0{i+1}</span><i/></div><div className="atlas-role-body"><div className="atlas-role-meta"><span>{role.period}</span><span>{role.location}</span></div><h2>{role.company}</h2><h3>{role.title}</h3><p>{role.summary}</p><ul>{role.highlights.map((h,j)=><li key={j}>{h}</li>)}</ul><div className="atlas-tagline">{role.stack.map((s)=><span key={s}>{s}</span>)}</div></div></article>)}</div>
  </div>;
}

export function AtlasAbout() {
  return <div className="atlas atlas-about"><header className="atlas-about-intro"><span className="atlas-kicker">ABOUT / THE ENGINEER BEHIND THE SYSTEMS</span><h1>Curious about<br/>what happens<br/><em>underneath.</em></h1><p>I’m {profile.name}, a computer science student at SUNY Oswego and a software engineering intern at Fanatics. I like systems that are clear under pressure, measurable in production, and useful to the people around them.</p><div className="atlas-about-stamp"><span>CLASS OF</span><strong>’26</strong><span>OSWEGO, NY</span></div></header>
    <section className="atlas-capabilities"><div className="atlas-section-label"><span>01</span><h2>Working<br/>vocabulary.</h2></div><div className="atlas-skill-flow">{skillGroups.map((g,i)=><article key={g.title}><span>0{i+1} / {g.title}</span><p>{g.note}</p><div>{g.skills.map(s=><span key={s}>{s}</span>)}</div></article>)}</div></section>
    <section className="atlas-education"><div className="atlas-section-label"><span>02</span><h2>Formal<br/>foundations.</h2></div><div className="atlas-education-copy"><span className="atlas-kicker">{education.graduation}</span><h3>{education.degree}</h3><p>{education.institution}</p><div>{education.courses.join(' / ')}</div></div></section>
    <section className="atlas-community"><div className="atlas-section-label"><span>03</span><h2>Outside<br/>the code.</h2></div><div><h3>Community & recognition</h3>{leadership.map((l)=><p key={l.role}><strong>{l.role}</strong> · {l.org}<br/>{l.note}</p>)}{recognition.map((r)=><p key={r.title}><strong>{r.title}</strong> · {r.year}<br/>{r.note}</p>)}</div></section>
  </div>;
}

type Form = {name:string;email:string;subject:string;message:string};
export function AtlasContact() {
  const [form,setForm]=useState<Form>({name:'',email:'',subject:'',message:''});
  const [status,setStatus]=useState<'idle'|'sending'|'sent'|'error'>('idle');
  const [error,setError]=useState('');
  async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault(); if(!form.name.trim()||!/^\S+@\S+\.\S+$/.test(form.email)||!form.subject.trim()||form.message.trim().length<20){setError('Add your name, a valid email, a subject, and a message of at least 20 characters.');return;} setError('');setStatus('sending');const result=await sendContact({...form,company:''});if(result.ok)setStatus('sent');else{setStatus('error');setError(result.error)}}
  return <div className="atlas atlas-contact"><header><span className="atlas-kicker">CONTACT / OPEN CHANNEL</span><h1>Have a system<br/>to <em>build?</em></h1><p>Tell me what you’re working on. I read every message and reply personally.</p></header><div className="atlas-contact-body"><aside><span>DIRECT LINE</span><a href={`mailto:${profile.email}`}>{profile.email} <Arrow/></a><span>FIND ME ELSEWHERE</span><a href={profile.github} target="_blank" rel="noreferrer">GitHub <Arrow/></a><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <Arrow/></a><span>BASED IN</span><p>{profile.location}</p></aside><form onSubmit={submit} noValidate><label>Name<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} autoComplete="name"/></label><label>Email<input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} autoComplete="email"/></label><label>Subject<input value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})}/></label><label>What are you building?<textarea rows={4} value={form.message} onChange={e=>setForm({...form,message:e.target.value})}/></label>{error&&<p className="atlas-form-error" role="alert">{error}</p>}{status==='sent'?<p role="status">Message sent. I’ll reply to {form.email}.</p>:<button type="submit" disabled={status==='sending'}>{status==='sending'?'Sending…':'Send message'} <Arrow/></button>}</form></div></div>;
}

export function AtlasNotFound(){return <div className="atlas atlas-not-found"><span className="atlas-kicker">ROUTE NOT FOUND</span><h1>This path<br/><em>ends here.</em></h1><Link to="/">Return to the start <Arrow/></Link></div>}

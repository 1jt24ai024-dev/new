import React, { useState } from 'react';
import { ArrowUpRight, Check, ExternalLink, FileText, Mail, Phone, X } from 'lucide-react';
import { formatExternalUrl } from '../utils/url';

function SectionIntro({ index, eyebrow, title, children }) {
  return (
    <div className="content-intro">
      <div className="content-kicker">
        <span>{String(index).padStart(2, '0')}</span>
        <span>{eyebrow}</span>
      </div>
      {title && <h2>{title}</h2>}
      {children}
    </div>
  );
}

function ImageTile({ src, alt, className = '' }) {
  if (!src) return <div className={`content-image-placeholder ${className}`}>NO IMAGE UPLOADED</div>;
  return <img className={className} src={src} alt={alt || ''} loading="lazy" />;
}

function AboutBlock({ data }) {
  if (!data || (!data.heading && !data.bio && !data.image)) return null;
  return (
    <section id="about" className="content-section content-about">
      <SectionIntro index={1} eyebrow="Profile" title={data.heading}>
        {data.resumeUrl && (
          <a className="content-link" href={formatExternalUrl(data.resumeUrl)} target="_blank" rel="noreferrer">
            <FileText size={15} /> Resume <ArrowUpRight size={15} />
          </a>
        )}
      </SectionIntro>
      <div className="about-layout">
        {data.image && <ImageTile src={data.image} alt={data.heading || 'About'} className="about-image" />}
        {data.bio && <p className="about-copy">{data.bio}</p>}
      </div>
    </section>
  );
}

function TimelineBlock({ data, id, index, eyebrow, title, type }) {
  if (!data?.items?.length || data.visible === false) return null;
  return (
    <section id={id} className="content-section">
      <SectionIntro index={index} eyebrow={eyebrow} title={title} />
      <div className="record-list">
        {data.items.map((item, itemIndex) => {
          const heading = type === 'education' ? item.degree : item.role;
          const label = type === 'education' ? item.institution : item.company;
          const period = type === 'education' ? item.year : item.duration;
          const image = item.logo;
          return (
            <article className="record-row" key={item._id || itemIndex}>
              <div className="record-index">{String(itemIndex + 1).padStart(2, '0')}</div>
              {image && <ImageTile src={image} alt={label} className="record-image" />}
              <div className="record-main">
                <div className="record-meta"><span>{period}</span><span>{label}</span></div>
                <h3>{heading}</h3>
                {item.description && <p>{item.description}</p>}
              </div>
              <ArrowUpRight className="record-arrow" size={20} />
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ProjectsBlock({ data }) {
  const [active, setActive] = useState(null);
  if (!data?.items?.length || data.visible === false) return null;
  return (
    <section id="projects" className="content-section projects-section">
      <SectionIntro index={4} eyebrow="Selected work" />
      <div className="project-grid">
        {data.items.map((project, index) => (
          <button className={`project-tile project-tile-${index % 3}`} key={project._id || index} onClick={() => setActive(project)}>
            <div className="project-visual"><ImageTile src={project.image} alt={project.title} /></div>
            <div className="project-info">
              <span className="project-number">{String(index + 1).padStart(2, '0')}</span>
              <h3>{project.title}</h3>
              {project.shortDescription && <p>{project.shortDescription}</p>}
              {project.techStack?.length > 0 && <span className="project-stack">{project.techStack.join(' / ')}</span>}
            </div>
          </button>
        ))}
      </div>
      {active && (
        <div className="content-modal" role="dialog" aria-modal="true" onClick={() => setActive(null)}>
          <div className="modal-sheet" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setActive(null)} aria-label="Close project"><X size={18} /></button>
            {active.image && <ImageTile src={active.image} alt={active.title} className="modal-image" />}
            <span className="content-kicker">Case study</span>
            <h2>{active.title}</h2>
            {active.details && <p className="modal-details">{active.details}</p>}
            <div className="modal-actions">
              {active.githubUrl && <a className="content-link" href={formatExternalUrl(active.githubUrl)} target="_blank" rel="noreferrer">GitHub <ExternalLink size={14} /></a>}
              {active.liveUrl && <a className="content-link content-link-solid" href={formatExternalUrl(active.liveUrl)} target="_blank" rel="noreferrer">Live demo <ArrowUpRight size={14} /></a>}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function CertificationsBlock({ data }) {
  if (!data?.items?.length || data.visible === false) return null;
  return (
    <section id="certifications" className="content-section">
      <SectionIntro index={5} eyebrow="Credentials" />
      <div className="credential-grid">
        {data.items.map((item, index) => (
          <article className="credential-card" key={item._id || index}>
            {item.image && <ImageTile src={item.image} alt={item.title} className="credential-image" />}
            <span>{item.date}</span>
            <h3>{item.title}</h3>
            <p><Check size={14} /> {item.issuer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ChroniclesBlock({ data }) {
  if (!data?.items?.length || data.visible === false) return null;
  return (
    <section id="chronicles" className="content-section chronicles-section">
      <SectionIntro index={6} eyebrow="Notes & research" />
      <div className="chronicle-grid">
        {data.items.map((item, index) => (
          <article className="chronicle-card" key={item._id || index}>
            {item.image && <ImageTile src={item.image} alt={item.title} className="chronicle-image" />}
            <div className="chronicle-meta"><span>{item.date}</span><span>{item.location}</span></div>
            <h3>{item.title}</h3>
            {item.description && <p>{item.description}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}

function ArchiveBlock({ data }) {
  if (!data?.items?.length || data.visible === false) return null;
  return (
    <section id="archive" className="content-section archive-section">
      <SectionIntro index={7} eyebrow="Visual archive" />
      <div className="archive-strip">
        {data.items.map((item, index) => (
          <figure key={item._id || index}>
            <ImageTile src={item.image} alt={item.title || 'Archive image'} />
            {item.title && <figcaption>{item.title}</figcaption>}
          </figure>
        ))}
      </div>
    </section>
  );
}

function ContactBlock({ data, socials = [] }) {
  const links = data?.socials?.length ? data.socials : socials;
  return (
    <section id="contact" className="content-section contact-section">
      <SectionIntro index={8} eyebrow="Open channel" title={data?.heading} />
      <div className="contact-layout">
        <div>
          <div className="contact-details">
            {data?.email && <a href={`mailto:${data.email}`}><Mail size={16} />{data.email}</a>}
            {data?.phone && <a href={`tel:${data.phone}`}><Phone size={16} />{data.phone}</a>}
            {links.map((social, index) => <a key={`${social.platform}-${index}`} href={formatExternalUrl(social.url)} target="_blank" rel="noreferrer"><ArrowUpRight size={16} />{social.platform}</a>)}
          </div>
        </div>
        {data?.image && <ImageTile src={data.image} alt={data.heading || 'Contact'} className="contact-image" />}
      </div>
    </section>
  );
}

export default function PublicContent({ content }) {
  return (
    <div className="public-content">
      <AboutBlock data={content?.about} />
      <TimelineBlock data={content?.education} id="education" index={2} eyebrow="Education" type="education" />
      <TimelineBlock data={content?.experience} id="experience" index={3} eyebrow="Experience" type="experience" />
      <ProjectsBlock data={content?.projects} />
      <CertificationsBlock data={content?.certifications} />
      <ChroniclesBlock data={content?.chronicles} />
      <ArchiveBlock data={content?.gridMotion} />
      <ContactBlock data={content?.contact} socials={content?.hero?.socials} />
    </div>
  );
}
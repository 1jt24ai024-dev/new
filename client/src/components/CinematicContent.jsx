import React from 'react';
import About from './About';
import Education from './Education';
import Experience from './Experience';
import Projects from './Projects';
import Certifications from './Certifications';
import Chronicles from './Chronicles';
import Contact from './Contact';
import Banner from './Banner';
import useCinematicScroll from '../hooks/useCinematicScroll';
import SceneProgress from './SceneProgress';

export default function CinematicContent({ content }) {
  const { sceneIndex, totalScenes, sceneIds } = useCinematicScroll();
  
  return (
    <div className="cinematic-content relative">
      <SceneProgress sceneIndex={sceneIndex} totalScenes={totalScenes} sceneIds={sceneIds} />
      
      {/* 02. IDENTITY */}
      <About data={content?.about} />
      
      {/* 03. JOURNEY (Education & Experience combined logically) */}
      <div className="journey-scene relative">
        <Education data={content?.education} />
        <Experience data={content?.experience} />
        <Certifications data={content?.certifications} />
      </div>
      
      {/* 04. WORK */}
      <Projects data={content?.projects} />
      
      {/* 05. RESEARCH / EXPERIMENTS */}
      <Chronicles data={content?.chronicles} />
      
      {/* 06. SIGNAL BANNER */}
      <Banner data={content?.banner} />

      {/* 07. CONTACT / ENDING */}
      <Contact data={content?.contact} heroSocials={content?.hero?.socials} />
    </div>
  );
}

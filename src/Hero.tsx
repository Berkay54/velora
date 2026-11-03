import { useEffect, useRef, useState, type RefObject } from 'react'
import './Hero.css'

// Timings follow the page turns in the supplied film, in seconds.
const scenes = [
  { start: 0, number: '00', label: 'VELORA ATELIER', title: 'Her sayfada', accent: 'başka bir hikâye.', description: 'Lezzetin, özenle açılan ilk sayfası.' },
  { start: 1.65, number: '01', label: 'AMANDINE CROISSANT', title: 'Kat kat', accent: 'bir mutluluk.', description: 'Altın renkli katmanlar. Bademin zarif dokunuşu.' },
  { start: 5.1, number: '02', label: 'WILD BERRY DANISH', title: 'Mevsimin', accent: 'en tatlı hâli.', description: 'İncecik katmanlarda orman meyvelerinin canlılığı.' },
  { start: 7.95, number: '03', label: 'VELVET CACAO TORTE', title: 'Yoğun bir tat.', accent: 'Kadife bir his.', description: 'Kakaonun derinliği, son lokmaya kadar.' },
] as const

type HeroProps = {
  videoRef: RefObject<HTMLVideoElement | null>
  onOpenFilm: () => void
}

export default function Hero({ videoRef, onOpenFilm }: HeroProps) {
  const [activeScene, setActiveScene] = useState(0)
  const sceneRef = useRef(0)
  const progress = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const film = videoRef.current
    if (!film) return
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const syncPlayback = () => {
      if (preference.matches) film.pause()
      else void film.play().catch(() => {})
    }

    const syncScene = (time = film.currentTime) => {
      const next = scenes.reduce((index, scene, i) => time >= scene.start ? i : index, 0)
      if (next !== sceneRef.current) {
        sceneRef.current = next
        setActiveScene(next)
      }
      const fraction = film.duration > 0 ? Math.min(time / film.duration, 1) : 0
      if (progress.current) progress.current.style.transform = `scaleX(${fraction})`
    }

    // Read the actual decoded frame. React only updates at a chapter boundary.
    let frameId: number | undefined
    let disposed = false
    const onFrame: VideoFrameRequestCallback = () => {
      if (disposed) return
      syncScene()
      frameId = film.requestVideoFrameCallback(onFrame)
    }
    if ('requestVideoFrameCallback' in film) frameId = film.requestVideoFrameCallback(onFrame)
    const onTimeChange = () => syncScene()
    film.addEventListener('timeupdate', onTimeChange)
    film.addEventListener('seeked', onTimeChange)
    film.addEventListener('loadedmetadata', onTimeChange)
    preference.addEventListener('change', syncPlayback)
    syncPlayback()
    return () => {
      disposed = true
      if (frameId !== undefined) film.cancelVideoFrameCallback(frameId)
      film.removeEventListener('timeupdate', onTimeChange)
      film.removeEventListener('seeked', onTimeChange)
      film.removeEventListener('loadedmetadata', onTimeChange)
      preference.removeEventListener('change', syncPlayback)
    }
  }, [videoRef])

  function selectScene(index: number) {
    const film = videoRef.current
    if (!film || film.readyState < 1) return
    film.currentTime = scenes[index].start + 0.08
  }

  return (
    <section className="cinematic-hero" aria-labelledby="hero-title" data-scene={activeScene}>
      <h1 id="hero-title" className="visually-hidden">Velora Atelier. Her sayfada başka bir hikâye.</h1>
      <video
        ref={videoRef}
        className="cinematic-video"
        src="/media/restaurant-film.mp4"
        poster="/media/hero-intro.jpg"
        muted={muted}
        loop
        playsInline
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setFailed(true)}
        aria-label="Velora Atelier: sayfaları açılan menüde bademli kruvasan, orman meyveli Danish ve kakaolu pasta"
      />
      <div className="cinematic-shade" aria-hidden="true" />

      <div className="scene-captions">
        {scenes.map((scene, index) => (
          <div key={scene.number} className={`scene-copy${index === activeScene ? ' is-active' : ''}`} aria-hidden={index !== activeScene}>
            <p className="scene-label"><span />{scene.label}</p>
            <h2>{scene.title}<br /><em>{scene.accent}</em></h2>
            <p className="scene-description">{scene.description}</p>
            <span className="scene-signature">L’ART DU GOÛT <span>— {scene.number}</span></span>
          </div>
        ))}
      </div>

      {failed && <p className="cinematic-error">Film yüklenemedi. Sayfayı yenileyerek tekrar deneyebilirsiniz.</p>}

      <div className="cinematic-bottom">
        <a className="cinematic-scroll" href="#hikayemiz"><span aria-hidden="true">↓</span><span>HİKÂYEYİ KEŞFET</span></a>
        <div className="chapter-picker" role="group" aria-label="Videonun sayfaları">
          {scenes.map((scene, index) => (
            <button key={scene.number} className={index === activeScene ? 'is-current' : ''} onClick={() => selectScene(index)} aria-label={`${scene.number}: ${scene.label}`} aria-pressed={index === activeScene}>
              <span>{scene.number}</span><span className="chapter-rule" />
            </button>
          ))}
        </div>
        <div className="cinematic-controls">
          <button onClick={onOpenFilm} className="expand-film" aria-label="Filmi büyük pencerede izle" title="Filmi büyük pencerede izle">⤢</button>
          <button onClick={() => { if (videoRef.current?.paused) void videoRef.current.play().catch(() => {}); else videoRef.current?.pause() }} aria-label={playing ? 'Videoyu duraklat' : 'Videoyu oynat'} title={playing ? 'Duraklat' : 'Oynat'}><span aria-hidden="true">{playing ? 'Ⅱ' : '▷'}</span></button>
          <button className="cinematic-sound" onClick={() => setMuted(!muted)} aria-label={muted ? 'Sesi aç' : 'Sesi kapat'} aria-pressed={!muted}><span className={muted ? 'sound-bars muted' : 'sound-bars'} aria-hidden="true"><i /><i /><i /><i /></span><span>SES {muted ? 'KAPALI' : 'AÇIK'}</span></button>
        </div>
      </div>
      <div className="film-timeline" aria-hidden="true"><div ref={progress} /></div>
    </section>
  )
}

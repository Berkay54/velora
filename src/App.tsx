import { useEffect, useRef, useState } from 'react'
import Hero from './Hero'
import './App.css'

const creations = [
  { name: 'Amandine Croissant', type: 'Fırından', note: 'Altın katmanlar, kavrulmuş badem, saf tereyağı.', image: 'croissant.jpg', number: '01' },
  { name: 'Wild Berry Danish', type: 'Fırından', note: 'Orman meyvelerinin tazeliği, incecik hamur katları.', image: 'danish.jpg', number: '02' },
  { name: 'Velvet Cacao Torte', type: 'Tatlı', note: 'Yoğun kakao, kadifemsi doku, mevsim meyveleri.', image: 'cacao.jpg', number: '03' },
]

function App() {
  const video = useRef<HTMLVideoElement>(null)
  const filmDialog = useRef<HTMLDialogElement>(null)
  const fullVideo = useRef<HTMLVideoElement>(null)
  const resumeAfterFilm = useRef(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [filter, setFilter] = useState('Tümü')
  const [lightTheme, setLightTheme] = useState(false)

  useEffect(() => {
    document.documentElement.dataset.theme = lightTheme ? 'light' : 'dark'
  }, [lightTheme])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('visible') })
    }, { threshold: 0.12 })
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  function openFilm() {
    resumeAfterFilm.current = video.current ? !video.current.paused : false
    video.current?.pause()
    filmDialog.current?.showModal()
    document.body.style.overflow = 'hidden'
    void fullVideo.current?.play().catch(() => {})
  }

  function closeFilm() {
    filmDialog.current?.close()
    fullVideo.current?.pause()
    document.body.style.overflow = ''
    if (resumeAfterFilm.current) void video.current?.play().catch(() => {})
  }

  return (
    <>
      <a className="skip-link" href="#main">İçeriğe geç</a>
      <header className="header cinematic-header" id="top">
        <a className="wordmark" href="#top" aria-label="Velora Atelier ana sayfa">VELORA<span>ATELIER</span></a>
        <nav className={mobileMenu ? 'navigation is-open' : 'navigation'} aria-label="Ana menü">
          <a href="#hikayemiz" onClick={() => setMobileMenu(false)}>Hikâyemiz</a>
          <a href="#koleksiyon" onClick={() => setMobileMenu(false)}>Koleksiyon</a>
          <a href="#deneyim" onClick={() => setMobileMenu(false)}>Deneyim</a>
        </nav>
        <a className="header-cta" href="#koleksiyon">Menüyü keşfet <span aria-hidden="true">↗</span></a>
        <button className="theme-toggle" onClick={() => setLightTheme(!lightTheme)} aria-label={lightTheme ? 'Koyu temaya geç' : 'Açık temaya geç'} title={lightTheme ? 'Koyu tema' : 'Açık tema'}>◐</button>
        <button className="mobile-toggle" onClick={() => setMobileMenu(!mobileMenu)} aria-expanded={mobileMenu} aria-label={mobileMenu ? 'Menüyü kapat' : 'Menüyü aç'}>{mobileMenu ? 'Kapat −' : 'Menü +'}</button>
      </header>

      <main id="main">
        <Hero videoRef={video} onOpenFilm={openFilm} />

        <section className="story section-pad reveal" id="hikayemiz">
          <div className="section-label"><span>01 / FELSEFEMİZ</span><span className="little-star" aria-hidden="true">✳</span></div>
          <div className="story-copy"><h2>Güzel şeyler<br /><em>özenle başlar.</em></h2><div><p>Bizim için lezzet, tabağa gelmeden çok önce başlar. Malzemeyi seçerken, hamuru dinlendirirken, son dokunuşu yaparken.</p><p>Velora Atelier, bu küçük anların bir araya geldiği yer. Bildiğiniz tatlara yeni bir gözle bakmanız için.</p><a className="text-link" href="#koleksiyon">Mutfağımızdan seçkiler <span aria-hidden="true">↗</span></a></div></div>
        </section>

        <section className="collection section-pad" id="koleksiyon">
          <div className="collection-heading reveal"><div><p className="eyebrow">02 / İMZA KOLEKSİYONU</p><h2>Bir sonraki <em>favoriniz.</em></h2></div><div className="filters" role="group" aria-label="Koleksiyonu filtrele">{['Tümü', 'Fırından', 'Tatlı'].map(item => <button key={item} className={filter === item ? 'selected' : ''} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>)}</div></div>
          <div className="creation-grid">{creations.filter(item => filter === 'Tümü' || item.type === filter).map(item => <article className="creation" key={item.name}><div className="creation-image"><img src={`/media/${item.image}`} alt={`${item.name}, Velora'nın animasyonlu menüsünden`} loading="lazy" width="900" height="700" /><span>{item.number} / VELORA</span></div><div className="creation-title"><h3>{item.name}</h3><span aria-hidden="true">↗</span></div><p>{item.note}</p></article>)}</div>
        </section>

        <section className="experience section-pad reveal" id="deneyim"><p className="eyebrow">03 / BİR VELORA ANI</p><h2>Bir menü açılır.<br /><em>Bütün duyular uyanır.</em></h2><p>Mum ışığı, tanıdık bir koku ve keşfedilmeyi bekleyen tatlar.<br />Deneyim, daha ilk sayfada başlar.</p><button className="primary-link" onClick={openFilm}>Dünyamıza adım atın <span aria-hidden="true">↗</span></button></section>
      </main>
      <footer><a className="wordmark" href="#top">VELORA<span>ATELIER</span></a><span>Özenle hazırlanmış küçük mutluluklar.</span><a href="#top" className="back-top">Başa dön ↑</a><span className="copyright">© {new Date().getFullYear()} Velora Atelier · Tasarım: <a href="https://dablabs.net/" target="_blank" rel="noopener">DAB Labs</a></span></footer>

      <dialog ref={filmDialog} className="film-dialog" onCancel={closeFilm} onClick={event => { if (event.target === event.currentTarget) closeFilm() }} aria-label="Velora Atelier filmi"><div className="dialog-top"><span>VELORA ATELIER / LE GOÛT</span><button onClick={closeFilm}>Filmi kapat ×</button></div><video ref={fullVideo} src="/media/restaurant-film.mp4" poster="/media/hero-poster.jpg" controls playsInline preload="none" /><p>Her sayfada başka bir hikâye.</p></dialog>
    </>
  )
}

export default App

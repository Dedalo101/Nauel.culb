// Mixcloud + SoundCloud embeds + contact bubble behavior
// Sources:
//   https://www.mixcloud.com/amooro/
//   https://soundcloud.com/nahuel-mendez-isla
//   https://www.instagram.com/nahuelthings

const MIXCLOUD_PROFILE_URL = 'https://www.mixcloud.com/amooro/';
const SOUNDCLOUD_PROFILE_URL = 'https://soundcloud.com/nahuel-mendez-isla';
const INSTAGRAM_URL = 'https://www.instagram.com/nahuelthings';
const CONTACT_EMAIL = 'GlueRecords@revamail.com';

// Extracted from Mixcloud profile (All shows) – titles updated to Nahuel
const SHOWS = [
  { title: 'Nahuel - Sticky fingers', url: 'https://www.mixcloud.com/amooro/deep-fingers/', source: 'mixcloud' },
  { title: 'Nahuel - TRICKS OR TREAT?', url: 'https://www.mixcloud.com/amooro/amoro-tricks-or-treat/', source: 'mixcloud' },
  { title: 'Nahuel - P A S S P O R T', url: 'https://www.mixcloud.com/amooro/a-m-o-r-o-p-a-s-s-p-o-r-t/', source: 'mixcloud' },
  { title: 'Nahuel - D A C I D', url: 'https://www.mixcloud.com/amooro/a-m-o-r-o-d-a-c-i-d/', source: 'mixcloud' },
  { title: 'Nahuel - S T R A W B E R R Y M O O N 023*', url: 'https://www.mixcloud.com/amooro/%E2%B2%81-%E2%B2%99-%E2%B2%9F-%EA%9E%85-%E2%B2%9F-s-t-r-a-w-b-e-r-r-y-m-o-o-n-023/', source: 'mixcloud' },
  { title: 'Nahuel - D A R K F A C E', url: 'https://www.mixcloud.com/amooro/a-m-o-r-o-d-a-r-k-f-a-c-e/', source: 'mixcloud' },
  { title: 'W E L C O M E S U N R I S E [chapterONE]', url: 'https://www.mixcloud.com/amooro/w-e-l-c-o-m-e-s-u-n-r-i-s-e-chapterone/', source: 'mixcloud' },
  { title: 'Nahuel - 7.609.', url: 'https://www.mixcloud.com/amooro/a-m-o-r-o-7609/', source: 'mixcloud' },
  { title: 'Nahuel - S O C O L', url: 'https://www.mixcloud.com/amooro/a-m-o-r-o-s-o-c-o-l/', source: 'mixcloud' },
  { title: 'Nahuel - 1.984', url: 'https://www.mixcloud.com/amooro/a-m-o-r-o-a-t-m-o-s-f-e-r/', source: 'mixcloud' }
];

const ACCENTS = ['#00FFFF', '#FF00FF', '#FFFF00', '#FF4500', '#9370DB'];

function setAccentFromTime() {
  const idx = Math.floor((Date.now() / 1000) * 0.3) % ACCENTS.length;
  document.documentElement.style.setProperty('--accent', ACCENTS[idx]);
}

function shuffleInPlace(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function mixcloudEmbedSrc(showUrl) {
  // Mixcloud widget expects an encoded feed path.
  const u = new URL(showUrl);
  const feed = encodeURIComponent(u.pathname);
  return `https://www.mixcloud.com/widget/iframe/?hide_cover=1&light=1&feed=${feed}`;
}

function soundcloudEmbedSrc(showUrl) {
  // SoundCloud widget embeds a track via the API widget.
  return `https://w.soundcloud.com/player/?url=${encodeURIComponent(showUrl)}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false`;
}

function renderShows() {
  const root = document.getElementById('mixcloudSets');
  if (!root) return;

  const shows = shuffleInPlace([...SHOWS]);
  const frag = document.createDocumentFragment();

  for (const show of shows) {
    const isSoundcloud = show.source === 'soundcloud';
    const sourceLabel = isSoundcloud ? 'SoundCloud' : 'Mixcloud';
    const frameClass = isSoundcloud ? 'soundcloudFrame' : 'mixcloudFrame';
    const embedSrc = isSoundcloud ? soundcloudEmbedSrc(show.url) : mixcloudEmbedSrc(show.url);

    const card = document.createElement('article');
    card.className = 'setCard';

    const titleRow = document.createElement('div');
    titleRow.className = 'setTitle';

    const link = document.createElement('a');
    link.href = show.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = show.title;

    const meta = document.createElement('small');
    meta.textContent = sourceLabel;

    titleRow.appendChild(link);
    titleRow.appendChild(meta);

    const iframe = document.createElement('iframe');
    iframe.className = frameClass;
    iframe.loading = 'lazy';
    iframe.allow = 'autoplay';
    iframe.src = embedSrc;
    iframe.title = `${show.title} (${sourceLabel} embed)`;

    card.appendChild(titleRow);
    card.appendChild(iframe);

    frag.appendChild(card);
  }

  root.innerHTML = '';
  root.appendChild(frag);

  // Subtle glitch pulse on random cards
  setInterval(() => {
    const cards = root.querySelectorAll('.setCard');
    if (!cards.length) return;
    const pick = cards[Math.floor(Math.random() * cards.length)];
    pick.classList.add('isGlitch');
    setTimeout(() => pick.classList.remove('isGlitch'), 360);
  }, 900);
}

function initContactBubble() {
  const bubble = document.getElementById('contactBubble');
  if (!bubble) return;

  let hops = 0;
  let armed = false;

  const revealContact = () => {
    const titleMount = document.getElementById('contactTitleMount');
    if (titleMount && !titleMount.dataset.ready) {
      const h2 = document.createElement('h2');
      h2.className = 'sectionTitle';
      h2.textContent = 'Contact';
      titleMount.appendChild(h2);
      titleMount.dataset.ready = '1';
    }

    const line = document.querySelector('#contact .contactLine');
    if (line) line.classList.remove('isHidden');
  };

  const teleport = () => {
    const rect = bubble.getBoundingClientRect();
    const pad = 14;

    const maxX = Math.max(pad, window.innerWidth - rect.width - pad);
    const maxY = Math.max(pad, window.innerHeight - rect.height - pad);

    const x = Math.floor(pad + Math.random() * (maxX - pad));
    const y = Math.floor(pad + Math.random() * (maxY - pad));

    bubble.style.opacity = '0';
    setTimeout(() => {
      bubble.style.left = `${x}px`;
      bubble.style.bottom = 'auto';
      bubble.style.top = `${y}px`;
      bubble.style.opacity = '1';
    }, 120);
  };

  const onHover = () => {
    if (armed) return;
    hops += 1;
    teleport();
    if (hops >= 2) {
      armed = true;
      bubble.classList.add('isArmed');
      revealContact();
      bubble.setAttribute('href', '#contact');
      bubble.setAttribute('aria-label', 'Contact');
      bubble.textContent = '@Contact';
    }
  };

  bubble.addEventListener('mouseenter', onHover);

  // Touch devices: treat taps as "hover" until armed, then open mail.
  bubble.addEventListener('click', (e) => {
    if (!armed) {
      e.preventDefault();
      onHover();
    }
  });
}

function initHeader() {
  // Set the page title to match the new branding.
  document.title = 'Nahuel — Never Not Playing';

  // Keep accent shifting over time for a living/glitchy feel.
  setAccentFromTime();
  setInterval(setAccentFromTime, 900);

  // Ensure social profile links are correct if they exist.
  const mixLinks = document.querySelectorAll('a[href*="mixcloud.com"]');
  for (const a of mixLinks) {
    if (a.getAttribute('href') === '#') a.setAttribute('href', MIXCLOUD_PROFILE_URL);
  }
  const scLinks = document.querySelectorAll('a[href*="soundcloud.com"]');
  for (const a of scLinks) {
    if (a.getAttribute('href') === '#') a.setAttribute('href', SOUNDCLOUD_PROFILE_URL);
  }
  const igLinks = document.querySelectorAll('a[href*="instagram.com"]');
  for (const a of igLinks) {
    if (a.getAttribute('href') === '#') a.setAttribute('href', INSTAGRAM_URL);
  }
}

function init() {
  initHeader();
  renderShows();
  initContactBubble();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

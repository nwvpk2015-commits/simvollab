/* ===== Карусели на странице «Наши работы» =====
   Чтобы добавить фото: положите файл в img/works/ (или img/photos/)
   и допишите его путь в нужный список ниже. Порядок = порядок показа. */
var GALLERIES = {
  flags:     { title: 'Флаги',       images: ['img/works/flagi.jpg','img/photos/flags_2.jpg','img/photos/flags_1.jpg','img/photos/flags_3.jpg'] },
  clothes:   { title: 'Одежда',      images: ['img/works/odejda.jpg','img/photos/clothes_1.jpg','img/photos/clothes_2.jpg','img/photos/clothes_3.jpg','img/photos/hats.jpg'] },
  souvenirs: { title: 'Сувениры',    images: ['img/works/suvenir.jpg','img/photos/souvenirs_2.jpg','img/photos/ejednevnik_bloknot_01.jpg'] },
  textile:   { title: 'Текстиль',    images: ['img/works/textil.jpg'] },
  print:     { title: 'Полиграфия',  images: ['img/works/poligraf.jpg','img/photos/souvenirs_3.jpg'] },
  events:    { title: 'Мероприятия', images: ['img/works/palatka.jpg','img/photos/events_1.jpg','img/photos/events_2.jpg','img/works/hero.jpg'] }
};

(function(){
  var dlg = document.getElementById('gallery'); if(!dlg) return;
  var img = document.getElementById('g-img'), title = document.getElementById('g-title');
  var dots = dlg.querySelector('.g-dots'), count = dlg.querySelector('.g-count');
  var prev = dlg.querySelector('.g-prev'), next = dlg.querySelector('.g-next'), stage = dlg.querySelector('.g-stage');
  var cur = null, i = 0;

  /* значок «N фото» на карточках */
  document.querySelectorAll('[data-gallery]').forEach(function(card){
    var g = GALLERIES[card.dataset.gallery]; if(!g) return;
    var b = document.createElement('span'); b.className = 'badge';
    b.textContent = g.images.length > 1 ? g.images.length + ' фото' : 'Смотреть';
    card.appendChild(b);
    card.addEventListener('click', function(){ open(card.dataset.gallery, 0); });
  });

  function show(n){
    var g = GALLERIES[cur], len = g.images.length;
    i = (n + len) % len;
    img.src = g.images[i]; img.alt = g.title + ' — фото ' + (i + 1);
    count.textContent = (i + 1) + ' / ' + len;
    Array.prototype.forEach.call(dots.children, function(d, k){ d.setAttribute('aria-current', k === i); });
    var nx = new Image(); nx.src = g.images[(i + 1) % len];      // подгружаем следующее
  }
  function open(key, n){
    cur = key; var g = GALLERIES[key];
    title.textContent = g.title;
    dlg.classList.toggle('g-single', g.images.length < 2);
    dots.innerHTML = '';
    g.images.forEach(function(_, k){
      var d = document.createElement('button'); d.type = 'button'; d.setAttribute('aria-label', 'Фото ' + (k + 1));
      d.addEventListener('click', function(){ show(k); }); dots.appendChild(d);
    });
    show(n); dlg.showModal();
  }
  prev.addEventListener('click', function(){ show(i - 1); });
  next.addEventListener('click', function(){ show(i + 1); });
  dlg.addEventListener('click', function(e){
    if(e.target === dlg || e.target === stage || e.target.hasAttribute('data-close')) dlg.close();
  });
  dlg.addEventListener('keydown', function(e){
    if(e.key === 'ArrowLeft') show(i - 1);
    if(e.key === 'ArrowRight') show(i + 1);
  });
  /* свайп на телефоне */
  var x0 = null;
  stage.addEventListener('touchstart', function(e){ x0 = e.touches[0].clientX; }, {passive:true});
  stage.addEventListener('touchend', function(e){
    if(x0 === null) return; var dx = e.changedTouches[0].clientX - x0; x0 = null;
    if(Math.abs(dx) > 40) show(dx < 0 ? i + 1 : i - 1);
  });
})();

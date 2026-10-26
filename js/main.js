(function(){
  var C = window.SITE_CONFIG || {};

  /* соцсети: если ссылка указана в config.js, иконка ведёт на страницу;
     пока ссылки нет, по нажатию показываем подсказку */
  var toast;
  function soon(){
    if(!toast){ toast = document.createElement('div'); toast.className = 'toast'; toast.textContent = 'Мы скоро появимся здесь — следите за обновлениями'; document.body.appendChild(toast); }
    toast.classList.add('show'); clearTimeout(toast._t); toast._t = setTimeout(function(){ toast.classList.remove('show'); }, 2600);
  }
  document.querySelectorAll('[data-soc]').forEach(function(a){
    var url = (C.social||{})[a.dataset.soc];
    if(url){ a.href = url; a.target = '_blank'; a.rel = 'noopener'; }
    else { a.addEventListener('click', function(e){ e.preventDefault(); soon(); }); }
  });

  /* мобильное меню */
  var burger = document.querySelector('.burger'), nav = document.getElementById('nav');
  if(burger && nav){
    burger.addEventListener('click', function(){
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
    });
  }

  /* окно с формой заявки */
  var dlg = document.getElementById('lead-dialog');
  document.querySelectorAll('[data-open-form]').forEach(function(b){
    b.addEventListener('click', function(){ if(dlg && dlg.showModal) dlg.showModal(); });
  });
  if(dlg){
    dlg.addEventListener('click', function(e){
      if(e.target === dlg || e.target.hasAttribute('data-close')) dlg.close();
    });
  }

  /* отправка формы */
  document.querySelectorAll('.lead-form').forEach(function(form){
    var status = form.querySelector('.status'), btn = form.querySelector('button[type=submit]');
    function say(t, cls){ status.textContent = t; status.className = 'status ' + (cls||''); }

    form.addEventListener('submit', function(e){
      e.preventDefault();
      var f = form.elements;
      var name = f.name.value.trim(), contact = f.contact.value.trim(), msg = f.message.value.trim();
      if(f.botcheck.value) return;                      // защита от спам-ботов
      if(!name || !contact){ say('Пожалуйста, укажите имя и телефон или e-mail.', 'err'); return; }

      if(!C.web3formsKey){                              // сервис отправки ещё не подключён
        var body = 'Имя: ' + name + '\nКонтакт: ' + contact + '\n\n' + msg;
        location.href = 'mailto:' + (C.email||'') + '?subject=' + encodeURIComponent('Новая заявка с сайта СимволЛаб') + '&body=' + encodeURIComponent(body);
        say('Открыли письмо в вашей почте — осталось нажать «Отправить».', 'ok');
        return;
      }
      btn.disabled = true; say('Отправляем…');
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {'Content-Type':'application/json','Accept':'application/json'},
        body: JSON.stringify({
          access_key: C.web3formsKey,
          subject: 'Новая заявка с сайта СимволЛаб',
          from_name: 'Сайт СимволЛаб',
          name: name, contact: contact, message: msg
        })
      }).then(function(r){ return r.json(); }).then(function(j){
        if(!j.success) throw new Error(j.message || 'error');
        say('Спасибо! Заявка отправлена, мы скоро свяжемся с вами.', 'ok'); form.reset();
      }).catch(function(){
        say('Не удалось отправить. Позвоните нам или напишите на ' + (C.email||''), 'err');
      }).then(function(){ btn.disabled = false; });
    });
  });
})();

/* ============================================
   HIKAKU NAVI - Global Navigation Injector
   ============================================ */

(function(){
  'use strict';

  // ---- Detect current page context ----
  var path = window.location.pathname;
  var isCredit = path.indexOf('/credit-card') !== -1;
  var isHikari = path.indexOf('/hikari') !== -1;
  var isSim    = path.indexOf('/sim') !== -1;
  var isNisa   = path.indexOf('/nisa') !== -1;

  // Relative path prefix to reach docs/mockups root
  function getRoot(){
    var depth = (path.match(/\//g)||[]).length;
    if(depth <= 3) return '../';
    return '../../';
  }
  var ROOT = getRoot();

  // ---- Build Breadcrumb ----
  function buildBreadcrumb(items){
    var html = '<nav class="breadcrumb"><div class="container">';
    html += '<a href="' + ROOT + 'pages/top.html">TOP</a>';
    items.forEach(function(item){
      html += '<span>›</span>';
      if(item.url) html += '<a href="' + item.url + '">' + item.label + '</a>';
      else html += item.label;
    });
    html += '</div></nav>';
    return html;
  }

  // ---- Build Header ----
  var headerHTML = [
    '<header>',
    '  <div class="container">',
    '    <div class="header-inner">',
    '      <a href="' + ROOT + 'pages/top.html" class="logo">HIKAKU<span>navi</span></a>',
    '      <nav class="global-nav">',
    '        <a href="' + ROOT + 'pages/credit-card/index.html"' + (isCredit?' class="active"':'') + '>クレジットカード</a>',
    '        <a href="' + ROOT + 'pages/hikari/index.html"' + (isHikari?' class="active"':'') + '>光回線</a>',
    '        <a href="' + ROOT + 'pages/sim/index.html"' + (isSim?' class="active"':'') + '>格安SIM</a>',
    '        <a href="' + ROOT + 'pages/nisa/index.html"' + (isNisa?' class="active"':'') + '>NISA</a>',
    '      </nav>',
    '      <span class="pr-badge">広告・PR含む</span>',
    '    </div>',
    '  </div>',
    '</header>'
  ].join('\n');

  // ---- Build Footer ----
  var footerHTML = [
    '<footer>',
    '  <div class="container">',
    '    <div class="footer-sitemap">',
    '      <div class="footer-col">',
    '        <h4>クレジットカード</h4>',
    '        <a href="' + ROOT + 'pages/credit-card/index.html">クレカ総合比較</a>',
    '        <a href="' + ROOT + 'pages/credit-card/no-fee.html">年会費無料カード</a>',
    '        <a href="' + ROOT + 'pages/credit-card/high-return.html">高還元率カード</a>',
    '      </div>',
    '      <div class="footer-col">',
    '        <h4>光回線</h4>',
    '        <a href="' + ROOT + 'pages/hikari/index.html">光回線総合比較</a>',
    '        <a href="' + ROOT + 'pages/hikari/mansion.html">マンション向け</a>',
    '        <a href="' + ROOT + 'pages/hikari/gaming.html">ゲーミング回線</a>',
    '      </div>',
    '      <div class="footer-col">',
    '        <h4>格安SIM</h4>',
    '        <a href="' + ROOT + 'pages/sim/index.html">格安SIM総合比較</a>',
    '        <a href="' + ROOT + 'pages/sim/data-plan.html">データ容量別</a>',
    '        <a href="' + ROOT + 'pages/sim/family.html">家族向けプラン</a>',
    '      </div>',
    '      <div class="footer-col">',
    '        <h4>NISA・投資</h4>',
    '        <a href="' + ROOT + 'pages/nisa/index.html">NISA総合比較</a>',
    '        <a href="' + ROOT + 'pages/nisa/beginner.html">初心者向けNISA</a>',
    '        <a href="' + ROOT + 'pages/nisa/fee.html">手数料比較</a>',
    '      </div>',
    '      <div class="footer-col">',
    '        <h4>サイト情報</h4>',
    '        <a href="#">運営情報</a>',
    '        <a href="#">プライバシーポリシー</a>',
    '        <a href="#">広告掲載について</a>',
    '        <a href="#">お問い合わせ</a>',
    '      </div>',
    '    </div>',
    '    <hr class="footer-divider">',
    '    <div class="footer-links">',
    '      <a href="#">運営情報</a>',
    '      <a href="#">プライバシーポリシー</a>',
    '      <a href="#">広告掲載について</a>',
    '      <a href="#">お問い合わせ</a>',
    '    </div>',
    '    <p class="footer-note">当サイトはAmazonアソシエイト・プログラム、楽天アフィリエイト、各種ASPのアフィリエイトプログラムに参加しています。掲載情報は各カード会社・通信事業者・金融機関の公式サイトをもとに作成していますが、最新情報は必ず公式サイトをご確認ください。</p>',
    '    <p class="footer-copy">© 2026 HIKAKUnavi. All rights reserved.</p>',
    '  </div>',
    '</footer>'
  ].join('\n');

  // ---- Inject on DOMContentLoaded ----
  document.addEventListener('DOMContentLoaded', function(){
    // Insert header before body first child
    var body = document.body;
    var existingHeader = document.querySelector('header');
    if(!existingHeader){
      body.insertAdjacentHTML('afterbegin', headerHTML);
    }

    // Insert footer
    var existingFooter = document.querySelector('footer');
    if(!existingFooter){
      body.insertAdjacentHTML('beforeend', footerHTML);
    }

    // Inject breadcrumb
    var bcPlaceholder = document.getElementById('breadcrumb-placeholder');
    if(bcPlaceholder){
      var bcItems = JSON.parse(bcPlaceholder.getAttribute('data-items')||'[]');
      bcPlaceholder.outerHTML = buildBreadcrumb(bcItems);
    }

    // FAQ accordion (no animate class)
    document.querySelectorAll('.faq-q').forEach(function(btn){
      btn.addEventListener('click', function(){
        var item = btn.closest('.faq-item');
        var isOpen = item.classList.contains('open');
        // Close all
        document.querySelectorAll('.faq-item.open').forEach(function(el){ el.classList.remove('open'); el.querySelector('.faq-q').setAttribute('aria-expanded','false'); });
        if(!isOpen){
          item.classList.add('open');
          btn.setAttribute('aria-expanded','true');
        }
      });
    });

    // Tab switch
    document.querySelectorAll('.tab-btn').forEach(function(btn){
      btn.addEventListener('click', function(){
        var targetId = btn.getAttribute('data-tab');
        var container = btn.closest('.tab-container')||document;
        container.querySelectorAll('.tab-btn').forEach(function(b){ b.classList.remove('active'); });
        container.querySelectorAll('.tab-panel').forEach(function(p){ p.classList.remove('active'); });
        btn.classList.add('active');
        var panel = document.getElementById(targetId);
        if(panel) panel.classList.add('active');
      });
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(function(btn){
      btn.addEventListener('click', function(){
        var group = btn.getAttribute('data-group');
        var val   = btn.getAttribute('data-value');
        // Toggle active within same group
        document.querySelectorAll('.filter-btn[data-group="' + group + '"]').forEach(function(b){ b.classList.remove('active'); });
        btn.classList.add('active');
        filterRows(group, val);
      });
    });

    function filterRows(group, val){
      var rows = document.querySelectorAll('tr[data-' + group + ']');
      rows.forEach(function(row){
        if(val==='all' || row.getAttribute('data-'+group)===val){
          row.style.display='';
        } else {
          row.style.display='none';
        }
      });
      // Also filter cards
      var cards = document.querySelectorAll('.card[data-' + group + ']');
      cards.forEach(function(card){
        if(val==='all' || card.getAttribute('data-'+group)===val){
          card.style.display='';
        } else {
          card.style.display='none';
        }
      });
    }

    // Sort table
    document.querySelectorAll('th.sortable').forEach(function(th){
      th.addEventListener('click', function(){
        var table = th.closest('table');
        var tbody = table.querySelector('tbody');
        var col   = Array.from(th.parentNode.children).indexOf(th);
        var asc   = !th.classList.contains('sort-asc');
        // Reset all
        table.querySelectorAll('th').forEach(function(t){ t.classList.remove('sort-asc','sort-desc'); });
        th.classList.add(asc ? 'sort-asc' : 'sort-desc');
        var rows = Array.from(tbody.querySelectorAll('tr'));
        rows.sort(function(a,b){
          var av = a.children[col]?a.children[col].innerText:'';
          var bv = b.children[col]?b.children[col].innerText:'';
          var an = parseFloat(av.replace(/[^0-9.-]/g,''));
          var bn = parseFloat(bv.replace(/[^0-9.-]/g,''));
          if(!isNaN(an)&&!isNaN(bn)) return asc? an-bn : bn-an;
          return asc? av.localeCompare(bv,'ja') : bv.localeCompare(av,'ja');
        });
        rows.forEach(function(r){ tbody.appendChild(r); });
      });
    });
  });

})();

(function(){
  var sheet=document.getElementById('sheet'),label=document.getElementById('sheetLabel');
  var btns=document.querySelectorAll('.sizes button');
  btns.forEach(function(b){
    b.addEventListener('click',function(){
      btns.forEach(function(x){x.setAttribute('aria-pressed','false')});
      b.setAttribute('aria-pressed','true');
      var w=+b.dataset.w,h=+b.dataset.h;
      sheet.style.setProperty('--r',(h/w).toFixed(4));
      label.textContent=w+' × '+h+' cm';
      sheet.setAttribute('aria-label','Hoja de papel de '+w+' por '+h+' centímetros con diseño de ejemplo');
    });
  });
  document.getElementById('quote').addEventListener('submit',function(e){
    e.preventDefault();
    var f=e.target,v=function(n){return f.elements[n].value.trim()};
    var t='Hola, quiero cotizar papel grado alimenticio personalizado.\n'+
      'Nombre: '+v('nombre')+'\n'+
      (v('negocio')?'Negocio: '+v('negocio')+'\n':'')+
      (v('ciudad')?'Ciudad: '+v('ciudad')+'\n':'')+
      'Medida: '+v('medida')+'\n'+
      (v('cantidad')?'Cantidad: '+v('cantidad')+'\n':'')+
      (v('mensaje')?'Detalles: '+v('mensaje'):'');
    window.open('https://wa.me/528124329263?text='+encodeURIComponent(t),'_blank','noopener');
  });
})();

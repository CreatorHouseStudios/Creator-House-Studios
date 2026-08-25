const cards=document.querySelectorAll('.card');
const observer=new IntersectionObserver(entries=>{
entries.forEach(e=>{
if(e.isIntersecting)e.target.classList.add('visible');
});
});
cards.forEach(c=>observer.observe(c));

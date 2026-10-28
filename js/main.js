document.addEventListener('DOMContentLoaded', () => {
    
    const burger = document.getElementById('burger-menu');
    const navMenu = document.getElementById('nav-menu');

    if(burger) {
        burger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    
    const faders = document.querySelectorAll('.fade-in');
    
    const appearOptions = { 
        threshold: 0.15, 
        rootMargin: "0px 0px -50px 0px" 
    };

    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            
            
            entry.target.classList.add('visible');
            
            
            appearOnScroll.unobserve(entry.target);
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });
});
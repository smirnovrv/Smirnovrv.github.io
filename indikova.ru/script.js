(function () {
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    const form = document.getElementById('booking-form');
    const formStatus = document.getElementById('form-status');

    if (burger && nav) {
        burger.addEventListener('click', function () {
            const open = nav.classList.toggle('is-open');
            burger.classList.toggle('is-open', open);
            burger.setAttribute('aria-expanded', open ? 'true' : 'false');
        });

        nav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                nav.classList.remove('is-open');
                burger.classList.remove('is-open');
                burger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    if (form && formStatus) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            formStatus.textContent = 'Спасибо! Заявка принята — мы перезвоним вам в ближайшее время.';
            formStatus.className = 'form-note is-success';
            form.reset();
        });
    }
})();

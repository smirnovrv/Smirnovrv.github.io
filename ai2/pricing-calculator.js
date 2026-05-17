(function () {
    'use strict';

    var PRICE_COD = 1500;
    var PRICE_DEV = 3500;

    var PRESETS = {
        1: [
            { name: '1С Бухгалтерия', users: 2, dev: false }
        ],
        2: [
            { name: '1С Торговля', users: 4, dev: false },
            { name: '1С Бухгалтерия', users: 1, dev: false }
        ],
        3: [
            { name: '1С Торговля', users: 4, dev: true },
            { name: '1С Бухгалтерия', users: 1, dev: false }
        ]
    };

    var programsEl = document.getElementById('pricing-programs');
    var breakdownEl = document.getElementById('pricing-breakdown');
    var totalEl = document.getElementById('pricing-total');
    var addBtn = document.getElementById('pricing-add-program');

    if (!programsEl || !breakdownEl || !totalEl) return;

    var rowId = 0;

    function formatMoney(n) {
        return n.toLocaleString('ru-RU');
    }

    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function createRow(data) {
        data = data || { name: '', users: 1, dev: false };
        var id = ++rowId;
        var row = document.createElement('div');
        row.className = 'pricing-program-row';
        row.setAttribute('role', 'listitem');
        row.dataset.id = String(id);

        row.innerHTML =
            '<div class="pricing-program-fields">' +
            '<label class="pricing-field">' +
            '<span class="pricing-field-label">Программа 1С</span>' +
            '<input type="text" class="pricing-input pricing-input--name" value="' + escapeHtml(data.name) + '" placeholder="Например: 1С Бухгалтерия">' +
            '</label>' +
            '<label class="pricing-field pricing-field--users">' +
            '<span class="pricing-field-label">Пользователей</span>' +
            '<input type="number" class="pricing-input pricing-input--users" min="1" max="999" step="1" value="' + (data.users || 1) + '">' +
            '</label>' +
            '<label class="pricing-field pricing-field--dev">' +
            '<input type="checkbox" class="pricing-input--dev"' + (data.dev ? ' checked' : '') + '>' +
            '<span>Услуга «Разработка ПО»</span>' +
            '</label>' +
            '</div>' +
            '<button type="button" class="pricing-btn pricing-btn--remove" title="Удалить программу" aria-label="Удалить программу">' +
            '<i class="fas fa-trash-alt" aria-hidden="true"></i>' +
            '</button>';

        row.querySelector('.pricing-btn--remove').addEventListener('click', function () {
            if (programsEl.children.length <= 1) return;
            row.remove();
            recalculate();
        });

        row.querySelectorAll('input').forEach(function (input) {
            input.addEventListener('input', recalculate);
            input.addEventListener('change', recalculate);
        });

        return row;
    }

    function getRowsData() {
        var rows = programsEl.querySelectorAll('.pricing-program-row');
        var items = [];
        rows.forEach(function (row) {
            var name = row.querySelector('.pricing-input--name').value.trim() || 'Программа';
            var users = parseInt(row.querySelector('.pricing-input--users').value, 10);
            var dev = row.querySelector('.pricing-input--dev').checked;
            if (isNaN(users) || users < 1) users = 1;
            items.push({ name: name, users: users, dev: dev });
        });
        return items;
    }

    function lineFormula(users, dev) {
        if (dev) {
            return users + ' × (' + formatMoney(PRICE_COD) + ' + ' + formatMoney(PRICE_DEV) + ')';
        }
        return users + ' × ' + formatMoney(PRICE_COD);
    }

    function lineSum(users, dev) {
        var perUser = PRICE_COD + (dev ? PRICE_DEV : 0);
        return users * perUser;
    }

    function recalculate() {
        var items = getRowsData();
        var total = 0;
        breakdownEl.innerHTML = '';

        items.forEach(function (item) {
            var sum = lineSum(item.users, item.dev);
            total += sum;
            var li = document.createElement('li');
            li.innerHTML =
                '<span class="pricing-breakdown-name">' + escapeHtml(item.name) + '</span>' +
                '<span class="pricing-breakdown-formula">' + lineFormula(item.users, item.dev) + ' = ' + formatMoney(sum) + ' ₽</span>';
            breakdownEl.appendChild(li);
        });

        if (items.length > 1) {
            var parts = items.map(function (item) {
                return formatMoney(lineSum(item.users, item.dev));
            });
            var liTotal = document.createElement('li');
            liTotal.className = 'pricing-breakdown-sum';
            liTotal.innerHTML =
                '<span class="pricing-breakdown-name">Итого</span>' +
                '<span class="pricing-breakdown-formula">' + parts.join(' + ') + ' = ' + formatMoney(total) + ' ₽</span>';
            breakdownEl.appendChild(liTotal);
        }

        totalEl.textContent = formatMoney(total);
    }

    function clearPrograms() {
        programsEl.innerHTML = '';
    }

    function loadPrograms(list) {
        clearPrograms();
        list.forEach(function (item) {
            programsEl.appendChild(createRow(item));
        });
        recalculate();
    }

    function addProgram(data) {
        programsEl.appendChild(createRow(data));
        recalculate();
    }

    addBtn.addEventListener('click', function () {
        addProgram({ name: '', users: 1, dev: false });
    });

    document.querySelectorAll('.pricing-btn--preset').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var key = btn.getAttribute('data-preset');
            if (PRESETS[key]) loadPrograms(PRESETS[key]);
        });
    });

    loadPrograms([{ name: '1С Бухгалтерия', users: 2, dev: false }]);
})();

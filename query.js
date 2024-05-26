const queryParams = new URLSearchParams(window.location.search);
const typeFilter = queryParams.get('type')
    ? queryParams.get('type').split(',')
    : [];
const orderParam = queryParams.get('order') ?? 'price-asc';

const dormFilter = document.getElementById('filter1');
const apartmentFilter = document.getElementById('filter2');
const houseFilter = document.getElementById('filter3');

const orderFilter = document.getElementById('order');

const query = document.getElementById('query');
const searchElement = document.getElementById('search-element');
const searchParam = queryParams.get('search') ?? '';

dormFilter.addEventListener('click', () => {
    if (typeFilter.includes('dorm')) {
        queryParams.set(
            'type',
            typeFilter.filter((type) => type != 'dorm').join(','),
        );
    } else {
        queryParams.set('type', [...typeFilter, 'dorm'].join(','));
    }

    window.location.search = queryParams.toString();
});

apartmentFilter.addEventListener('click', () => {
    if (typeFilter.includes('apartment')) {
        queryParams.set(
            'type',
            typeFilter.filter((type) => type != 'apartment').join(','),
        );
    } else {
        queryParams.set('type', [...typeFilter, 'apartment'].join(','));
    }

    window.location.search = queryParams.toString();
});

houseFilter.addEventListener('click', () => {
    if (typeFilter.includes('house')) {
        queryParams.set(
            'type',
            typeFilter.filter((type) => type != 'house').join(','),
        );
    } else {
        queryParams.set('type', [...typeFilter, 'house'].join(','));
    }

    window.location.search = queryParams.toString();
});

orderFilter.addEventListener('change', () => {
    queryParams.set('order', orderFilter.value);

    window.location.search = queryParams.toString();
});

query.addEventListener('submit', (e) => {
    e.preventDefault();

    queryParams.set('search', query.search.value);

    window.location.search = queryParams.toString();
});

window.addEventListener('load', () => {
    dormFilter.checked = typeFilter.includes('dorm');
    apartmentFilter.checked = typeFilter.includes('apartment');
    houseFilter.checked = typeFilter.includes('house');

    orderFilter.value = orderParam;

    searchElement.value = searchParam;
});

class View {
    renderMe(data, container) {
        container.innerText = `Друзья на странице ${data.first_name} ${data.last_name}`;
    }
    renderFriends(data, container) {
        if(data && container){
            let ul = document.createElement('UL');
            ul.classList.add('friends__list');
            let frag = document.createDocumentFragment();
            data.forEach(item => {
                let li = document.createElement('LI');
                let img = document.createElement('IMG');
                let b = document.createElement('B');
                li.classList.add('friends__item');
                img.src = item.photo_100;
                b.innerText = `${item.first_name} ${item.last_name}`;
                li.appendChild(b);
                li.appendChild(img);
                frag.appendChild(li);
            });
            ul.appendChild(frag);
            container.innerHTML = "";
            container.appendChild(ul);
        }

    }
    renderList(data, container) {
        if(data && container) {
            let ul = document.createElement('UL');
            let frag = document.createDocumentFragment();
            data.forEach(item => {
                let li = document.createElement('LI');
                let a = document.createElement('A');
                a.setAttribute('href', '#');
                a.innerText = item;
                li.appendChild(a);
                frag.appendChild(li);
            });
            ul.appendChild(frag);
            container.innerHTML = "";
            container.appendChild(ul);
        }
    }
};

export {View};
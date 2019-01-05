import {MyVk} from './class.js';
import {View} from './view.js';

window.addEventListener('DOMContentLoaded', () => {
    const
        worker = new MyVk('5.92')
        ,view = new View()
        ,friendList = document.querySelector('.list__all')
        ,friendFilter = document.querySelector('.list__filter')
        ,friendFave = document.querySelector('.list__fave')
        ,title = document.querySelector('.header__title')
        ,inputFilter = document.querySelector('.filter')
        ,inputNameList = document.querySelector('.nameList')
        ,add = document.querySelector('.add');

    (async ()=>{
        await worker.login(6808614, 2);
        const self = await worker.getSelf();
        let me = worker.getSelfItem(self);
        view.renderMe(me, title);
        //Получаем всех друзей и загружаем их
        const friends = await worker.getFriends();
        let friendsData = await worker.getFriendsList(friends);
        view.renderFriends(friendsData, friendList);

        //Загрузка списка из УРЛ
        let activeListName = worker.getURL('=');
        if(activeListName){
          let activeList = worker.loadList('local', activeListName);
          view.renderFriends(activeList, friendFilter);
        }




        //Фильтруем друзей
        inputFilter.addEventListener('keyup', async (e)=>{
            let value = e.target.value;
            let filter = await worker.filterList(friendsData, value);
            view.renderFriends(filter, friendFilter);
            worker.save('session', 'temp', filter);
        });
        //Запоминаем списки
        add.addEventListener('click', async ()=>{
            let value = inputNameList.value;
            let temp = worker.load('session', 'temp');
            worker.save('local', value, temp);
            let list = worker.loadListName('local');
            view.renderList(list, friendFave);

            worker.saveURL(value);
        });
        //Выводим сохраненные списки
        let list = worker.loadListName('local');
        view.renderList(list, friendFave);

        //Загружаем список по клику
        friendFave.addEventListener('click', async (e)=>{
            let item = e.target;
            if(item.tagName === "A"){
                e.preventDefault();
                let value = item.innerText;
                let res = worker.loadList('local', value);
                view.renderFriends(res, friendFilter);
                worker.loadURL(value);
            }
        });

        window.addEventListener('popstate', () => {
            let activeListName = worker.getURL('=');
            let activeList = worker.loadList('local', activeListName);
            view.renderFriends(activeList, friendFilter);
        })

    })();

});


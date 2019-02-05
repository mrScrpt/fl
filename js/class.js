class MyVk {
	constructor(v, gen) {
		this.paramsSelf = {v: v || '5.92', name_case: gen || 'gen'};
		this.paramsFriends = {v: v || '5.92', fields: 'photo_100'};
	}

	login(appId, perms) { //6784868 //2
		return new Promise((resolve, reject) => {
			VK.init({
				apiId: appId //6784868
			});
			VK.Auth.login(data => {
				if (data.session) {
					resolve(data);
				} else {
					reject('Ошибка авторизации');
				}
			}, perms); //2
		});
	}

	callApi(method, params) {
		return new Promise((resolve, reject) => {
			VK.api(method, params, (data) => {
				if (data.error) {
					reject(data.error);
				} else {
					resolve(data.response);
				}
			});
		});
	}

	getSelf() {
		return this.callApi('users.get', this.paramsSelf);

	}

	getSelfItem(data) {
		let [me] = data;
		return me;
	}

	getFriends() {
		return this.callApi('friends.get', this.paramsFriends);
	}

	getFriendsList(data) {
		let arr = [];
		for (let row in data.items) {
			arr.push(data.items[row]);
		}
		return arr;
	}

	filterList(arr, params) {
		let res = [];
		//let regexp = new RegExp(params, 'i');
		arr.forEach((item) => {
			//if (item.first_name.search(regexp) > -1 || item.last_name.search(regexp) > -1) {
			if (item.first_name.includes(params) || item.last_name.includes(params)) {
				//console.log(item);
				res.push(item);
				return true;
			} else {
				return false;
			}

		});
		return res;

	}

	save(storage, name, arr) {
		let data = JSON.stringify(arr);
		if (storage === 'local') {
			localStorage[name] = data;
		}
		if (storage === 'session') {
			sessionStorage[name] = data;
		}

	}

	load(storage, name) {
		let arr = [];
		if (storage === 'local') {
			arr = JSON.parse(localStorage[name]);
		}
		if (storage === 'session') {
			arr = JSON.parse(sessionStorage[name]);
		}
		return arr;
	}

	loadListName(storage) {
		let s = '';
		let name = [];
		if (storage === 'local') {
			s = localStorage;
		} else if (storage === 'session') {
			s = sessionStorage;
		} else {
			throw new Error('Харнилище не найдено');
		}
		for (let i = 0; i < s.length; i++) {
			let key = s.key(i);
			name.push(key);
		}
		if (name.length === 0) {
			return;
		}
		return name;
	}

	loadList(storage, name) {
		let arr = [];
		if (name === '/') {
			return;
		} else if (localStorage[name] || sessionStorage[name]) {
			if (storage === 'local') {
				arr = JSON.parse(localStorage[name]);
			} else if (storage === 'session') {
				arr = JSON.parse(sessionStorage[name]);
			} else if (!arr.length) {
				throw new Error('список пустой');
			}
			return arr;
		} else {
			throw new Error('список не существует');
		}

	}

	renderList(storage) {
		//Выводим сохраненные списки при клике
		let list = this.loadListName(storage);
		if (list) {

			View.renderList(list, friendFave);
		}
		;
	}

	saveURL(name) {
		history.pushState({}, 'new state', '/list=' + name);

	}

	loadURL(name) {
		try {
			history.pushState(null, null, '/list=' + name);
			return;
		} catch (e) {
			console.error(e);
		}
		location.hash = '/list=' + name;
	}

	getURL(list, separator) {
		let url = decodeURIComponent(location.pathname);
		let regexp = new RegExp(list, 'i');

		if (url.search(regexp) === -1) {
			return false;
		}
		let from = url.search(separator) + 1;
		let to = url.length;
		return url.substring(from, to);
	}

	destroy(elem) {
		let list = elem.querySelectorAll('*');
		for (let i = 0; i < list.length; i++) {
			list[i].remove();
			console.log(list[i]);
		}
	}
}

export {MyVk};
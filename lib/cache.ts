import * as Memcached from 'memcached';
import * as nodememorycache from 'memory-cache';

class MemcachedAdapter {
	memcached: any;

	constructor(hosts) {
		this.memcached = new Memcached(hosts);
	}

	get(key: string, cb): void {
		this.memcached.get(key, (err, result) => {
			cb(err, result ? result.data : null);
		});
	}

	upsert(key, data, duration, cb): void {
		this.memcached.get(key, (err, result) => {
			if (err) {
				return cb(err);
			}
			if (!result) {
				this.memcached.set(key, {data: data}, duration, (err2) => {
					if (err2) {
						return cb(err2);
					}
					cb(null, true);
				});
			} else {
				cb(null, false);
			}
		});
	}
}

class NodeCacheAdapter {
	nodecache = nodememorycache;

	constructor() {
	}

	get(key, cb) {
		let c = this.nodecache.get(key);
		cb(null, c ? c.data : null);
	}

	upsert(key, data, duration, cb) {
		let c = this.nodecache.get(key);
		if (!c) {
			let maximum_waittime = 2147483647; // max wait time
			this.nodecache.put(key, {data: data}, maximum_waittime);
			cb(null, true);
		} else {
			cb(null, false);
		}
	}
}

class NullCacheAdapter {
	constructor() {
	}

	get(key, cb) {
		cb();
	}

	upsert(key, data, duration, cb) {
		cb(null, false);
	}
}

export interface Cache {
	get: (key: string, cb: (err, data) => void) => void;
	upsert: (key: string, data: Object, duration: number, cb: (err, data) => void) => void;
}

export const CacheFOREVER = 0;

export function initCache(options): Cache {
	if (options) {
		if (options.type === 'memcached') {
			return new MemcachedAdapter(options.memcached);
		}
		if (options.type === 'internal') {
			return new NodeCacheAdapter();
		}
	}
	return new NullCacheAdapter();
}


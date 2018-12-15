import * as bcrypt from "bcrypt";
import { Observable, of, from } from "rxjs";
import { switchMap } from "rxjs/operators";

export interface PasswordStrategyInterface {
	hash(hash: string): Observable<string>;
	verify(known:string, hash: string): Observable<boolean>;
}

export class BCryptStrategy implements PasswordStrategyInterface {
	private salt: number = 12;

	hash(hash: string): Observable<string> {
        console.log("a",hash);
		return from(bcrypt.hash(hash, this.salt));
	}

	verify(known:string, hash: string): Observable<boolean> {
		console.log("xxx", known, hash,bcrypt.compare(known, hash));
        return from(bcrypt.compare(known, hash));
	}
}

export class PasswordStrategy implements PasswordStrategyInterface {
	private strategy: PasswordStrategyInterface;

	constructor(strategy: PasswordStrategyInterface) {
		this.strategy = strategy;
	}

	hash(hash: string): Observable<string> {
		const source: Observable<string> = of(hash);

		return source.pipe(switchMap(str => this.strategy.hash(str)));
	}

	verify(known:string, hash: string): Observable<boolean> {
		return this.strategy.verify(known, hash);
        /*const source: Observable<boolean> = of(false);

		return source.pipe(switchMap(str => this.strategy.verify(known, hash)));*/
	}
}

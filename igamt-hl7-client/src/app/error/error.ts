import {Error} from "tslint/lib/error";


export class ResolvingError1 extends TypeError{

  constructor(message?: string) {
    // 'Error' breaks prototype chain here
    super(message);

  }
}



export class ResolvingError extends ResolvingError1{

  constructor(message?: string) {
    // 'Error' breaks prototype chain here
    super(message);

  }
}


import {Transform} from 'stream';
class AppendInitVect extends Transform {
  initVect: Buffer;
  appended: Boolean;
  constructor(initVect, opts?) {
    super(opts);
    this.initVect = initVect;
    this.appended = false;
  }

  _transform(chunk, encoding, cb) {
    if (!this.appended) {
      this.push(Buffer.from(this.initVect));
      this.appended = true;
    }
    this.push(chunk);
    cb();
  }
}

export default AppendInitVect;

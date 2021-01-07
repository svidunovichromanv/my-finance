import { writeSync, openSync, closeSync, write, open, close } from 'fs';
const os = require('os');

export function logLineSync(logFilePath: string, logLine: string): void {
    const logDT=new Date();
    let time=logDT.toLocaleDateString()+" "+logDT.toLocaleTimeString();
    let fullLogLine=time+" "+logLine;

    console.log(fullLogLine);

    const logFd = openSync(logFilePath, 'a+');
    writeSync(logFd, fullLogLine + os.EOL);
    closeSync(logFd);
}

export function logLineAsync(logFilePath:string, logLine: string): Promise<null> {
    return new Promise( (resolve,reject) => {

        const logDT=new Date();
        let time=logDT.toLocaleDateString()+" "+logDT.toLocaleTimeString();
        let fullLogLine=time+" "+logLine;

        console.log(fullLogLine);

        open(logFilePath, 'a+', (err,logFd) => {
            if ( err )
                reject(err);
            else
                write(logFd, fullLogLine + os.EOL, (err) => {
                    if ( err )
                        reject(err);
                    else
                        close(logFd, (err) =>{
                            if ( err )
                                reject(err);
                            else
                                resolve(null);
                        });
                });

        });

    } );

}

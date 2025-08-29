import { server } from './server';
import { DataBaseModel } from './model/DatabaseModel';

const port: number = 3333;

new DataBaseModel().testeConexao().then((resbd) => {
    if(resbd) {
        server.listen(port, () => {
            console.log(`Aplicação on-line em http://localhost:${port}`);
        })
    } else {
        console.log('Não foi possível conectar ao banco de dados');
    }
})
//MODULOS EXTERNOS
const inquirer = require('inquirer')
const chalk = require('chalk')

//MODULOS INTERNOS
const fs = require('fs')

//cria lista de opções
const operation = () =>{
    inquirer.prompt([
        {
        type: 'list',
        name: 'action',
        message: 'O que voce deseja fazer?',
        choices: [
            'Criar conta',
            'Consultar saldo',
            'Depositar',
            'Sacar',
            'Sair'
        ],
    }
])
.then((answer) =>{
    const action  = answer['action']

    if(action === 'Criar conta'){
        createAccount()
    }else if(action === 'Depositar'){
        deposit()
    }else if(action === 'Sacar'){

    }else if(action === 'Consultar Saldo'){

    }else if(action === 'Sair'){
        console.log(chalk.bgBlue.black('Obrigado por usar o Accounts!'))
        process.exit()
    }
})
.catch((err) => console.log(err))
}

//cria operações
const createAccount = () =>{
    console.log(chalk.bgGreen.black("Obrigado por escolher nosso banco!"))
    console.log(chalk.green('Defina as opções de sua conta a seguir'))
    buildAccount()
}

const buildAccount = () =>{
    inquirer.prompt([{
        name: 'accountName',
        message: 'Digite um nome para sua conta: '
    }])
    .then((answer) => {
        const accountName = answer['accountName']
        console.info(accountName)

        if(!fs.existsSync('accounts')){
            fs.mkdirSync('accounts')
        }

        if(fs.existsSync(`accounts/${accountName}.json`)){
            console.log(
                chalk.bgRed.black('Essa conta já existe, escolha outro nome!'),
            )
            buildAccount()
            return
        }

        fs.writeFileSync(`accounts/${accountName}.json`, 
        '{"balance": 0}',
        function(err){
            console.log(err)
        })
        console.log(chalk.green('Sua conta foi criada!'))
        operation()
    })
    .catch((err) => console.log(err))
}

//função deposito
const deposit = () =>{
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ])
    .then((answer) => {
        const accountName = answer['accountName']
        if(!checkAccount(accountName)){
            return deposit()
        }
    })
    .catch((err) => console.log(err))
}

//Verifica se a conta existe
function checkAccount(accountName){
    if(!fs.existsSync(`accounts/${accountName}.json`)){
        console.log(chalk.bgRed.black('Esta conta não existe, escolha outro nome!'))
        return false
    }else{
        return true
    }
}


operation()
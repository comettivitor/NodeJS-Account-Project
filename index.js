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
        withdraw()
    }else if(action === 'Consultar saldo'){
        getBalance()
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

        inquirer.prompt([
            {
                name:'amount',
                message: 'Quanto você deseja depositar?'
            },
        ]).then((answer) => {
            const amount = answer['amount']
            //adiciona valor
            addAmount(accountName, amount)
            operation()

        }).catch((err) => console.log(err))
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

function addAmount(accountName, amount){
    const accountData = getAccount(accountName)
    if(!amount){
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde...'))
        return deposit()
    }
    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function(err){
            console.log(err)
        },
    )
    console.log(chalk.green(`Foi depositado o valor de ${amount} na sua conta!`))
}

function getAccount(accountName){
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding:'utf8',
        flag: 'r'
    })
    return JSON.parse(accountJSON)
}

//mostra saldo da conta
function getBalance(){
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual conta deseja consultar?'
        },
    ])
    .then((answer) => {
        const accountName = answer['accountName']
        if(!checkAccount(accountName)){
            return getBalance()
        }

        const accountData = getAccount(accountName)
        console.log(chalk.bgBlue.black(`olá, o saldo é: R$${accountData.balance}`))
        operation()
    })
    .catch(err => console.log(err))
}

//saque
function withdraw(){
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ])
    .then((answer) => {
        const accountName = answer['accountName']
        if(!checkAccount(accountName)){
            return withdraw()
        }
        inquirer.prompt([
            {
                name: 'amount',
                message: 'Quanto deseja sacar?'
            }
        ]).then((answer) => {
            const amount = answer['amount']
            removeAmount(accountName, amount)
        }).catch(err => console.log(err))

    })
    .catch(err => console.log(err))
}

function removeAmount(accountName, amount){
    const accountData = getAccount(accountName)
    if(!amount){
        console.log(chalk.bgRed.black('Ocorreu erro!'))
        return withdraw()
    }
    
    if(accountData.balance < amount){
        console.log(chalk.bgRed.black('Valor indisponível'))
        return withdraw()
    }

    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function(err){
            console.log(err)
        }
        )
        console.log(chalk.green(`Foi realizado um saque de ${amount} reais da sua conta!`))
        operation()
}


operation()
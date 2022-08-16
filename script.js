let modalQt = 1
let modalSize = 2
let key = 0
let cart = []
//Bloco para preencher a página e o modal (=pizzaWindow)
pizzaJson.map((item,index)=>{
    let pizzaItem = document.querySelector(".models .pizza-item").cloneNode(true) //Copia o modelo da estrutura em HTML para cada item do objeto pizzaJson
    document.querySelector(".pizza-area").append(pizzaItem) //Adiciona cada modelo de cada item do pizzaJson à area grid da pizza
    pizzaItem.setAttribute("pizza-id",index) //Adiciona o id de cada pizza ao pizzaItem

    //neste bloco preenche o modelo copiado para pizzaItem 
    pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name
    pizzaItem.querySelector(".pizza-item--img img").src = item.img
    pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description
    pizzaItem.querySelector(".pizza-item--price").innerHTML = `R$ ${item.price[2].toFixed(2)}`
    
    //bloco para preenchimento do modal e ações após o clique na pizza
    pizzaItem.querySelector("a").addEventListener('click',(e)=>{ //seleciona o link "a" e adiciona um evento de click
        e.preventDefault() //Desativa o evento padrão de atualizar a tela quando clica no link
        let pizzaWindow = document.querySelector(".pizzaWindowArea")
        pizzaWindow.style.opacity = 0
        pizzaWindow.style.display = 'flex' //mostra o modal pizzaWindowArea
        setTimeout(()=>{pizzaWindow.style.opacity = 1},200) //Adiciona um delay para que o efeito para não abrir bruscamente seja acionado
        key = e.target.closest(".pizza-item").getAttribute('pizza-id') //cria uma variável key que recebe o id da pizza clicada. (closest() serve pra pegar o elemento mais próximo da classe "pizza-item")
        modalQt = 1 //sempre inicia a quantidade de pizzas como 1

        //bloco para preencher o pizzaWindow
        document.querySelector(".pizzaInfo h1").innerHTML = pizzaJson[key].name
        document.querySelector(".pizzaInfo .pizzaInfo--desc").innerHTML = pizzaJson[key].description
        price(modalSize) //preenche o valor padrão do preço no modal
        document.querySelector(".pizzaInfo--size.selected").classList.remove('selected')//remove o último tamanho selecionado
        document.querySelectorAll(".pizzaInfo--size").forEach((size, sizeIndex)=>{ //seleciono todos os .pizzaInfo--size e para cada um eu aplico a funçao que recebe o tamanho e o indice do tamanho
            if(sizeIndex == 2){
                size.classList.add('selected') //se o index do tamanho for 2, ou seja, tamanho grande, adiciono .selected pra que sempre que abra a pizzaWindow o tamanho grande esteja selecionado
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex] //aplica para cada tamanho, dentro do seu span o valor do tamanho em g de acordo com o index do tamanho
        })     
        document.querySelector(".pizzaBig img").src = pizzaJson[key].img //adiciona a imagem na pizzaWindow
        document.querySelector(".pizzaInfo--qt").innerHTML = modalQt //quantidade no HTML recebe variavel quantidade

    })
})

//Funcionamento do modal
function closeModal(){
    let pizzaWindow = document.querySelector(".pizzaWindowArea")
        pizzaWindow.style.opacity = 0 //esconde o modal pizzaWindowArea
        setTimeout(()=>{pizzaWindow.style.display = 'none'},200) //Adiciona um delay para que o efeito fechar não bruscamente seja acionado
         
}


//executa a função closeModal para os dois botões do modal, tanto desktop quanto mobile
document.querySelectorAll(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach((item)=>{
    item.addEventListener("click",closeModal)
})

//faz botão de - do modal diminuir a quantidade selecionada
document.querySelector(".pizzaInfo--qtmenos").addEventListener("click",(e)=>{
    if (modalQt > 1){ //só diminui até quantidade = 1
        modalQt--
        document.querySelector(".pizzaInfo--qt").innerHTML = modalQt
    }
})

//faz botão de + do modal aumentar a quantidade selecionada
document.querySelector(".pizzaInfo--qtmais").addEventListener("click",(e)=>{
    modalQt++
    document.querySelector(".pizzaInfo--qt").innerHTML = modalQt
})
 
//seleciona o tamanho da pizza
document.querySelectorAll(".pizzaInfo--size").forEach((size,sizeIndex)=>{ //seleciono todos os .pizzaInfo--size e para cada um eu aplico a funçao que recebe o tamanho e o indice do tamanho
    size.addEventListener('click',(e)=>{
        document.querySelector(".pizzaInfo--size.selected").classList.remove('selected')//remove o último tamanho selecionado
        size.classList.add('selected')
        price(sizeIndex) //roda a função de preço pra mudar o preço exibido no modal toda vez que clica em tamanho diferente
    
    })
})

//altera o preço mostrado no modal de acordo com o tamanho selecionado
function price(modalSize){
    document.querySelector(".pizzaInfo--actualPrice").innerHTML = `R$ ${pizzaJson[key].price[modalSize].toFixed(2)}`
}

//configurando o botão "adicionar ao carrinho"
document.querySelector(".pizzaInfo--addButton").addEventListener("click",(e)=>{
    let size = document.querySelector(".pizzaInfo--size.selected").getAttribute("data-key")  //pega o atributo data-key do tamanho, assim é possível saber exatamente o tamanho selecionado
    pizzaCode = `${pizzaJson[key].id}@${size}` //cria um código de identificação da pizza de acordo com tipo e tamanho

    let verifier = cart.findIndex((item)=>item.identifier == pizzaCode) //verifica se no carrinho já há alguma pizza do mesmo tipo e tamanho
    if (verifier > -1){ //a função .findIndex() retorna -1 caso não ache nada igual ou retorna o indice do elemento igual
        cart[verifier].qtde+=modalQt //se já há alguma pizza do mesmo tipo e tamanho somente adiciona a quantidade
    }else{
        cart.push({ //se não houver pizzas do mesmo tamanho e tipo no carrinho adiciona uma nova
            identifier: pizzaCode,
            id: pizzaJson[key].id,
            size: size,
            qtde: modalQt
        })
    }
    updateCart()
    closeModal() //fecha o modal
})

document.querySelector(".menu-openner").addEventListener("click",(e)=>{
    if (cart.length > 0){
        document.querySelector("aside").style.left = '0vw'
    }
    
})

document.querySelector(".menu-closer").addEventListener("click",(e)=>{
    document.querySelector("aside").style.left = '100vw'
})


function updateCart(){

    document.querySelector(".menu-openner span").innerHTML = cart.length
    


    if (cart.length > 0){
        document.querySelector("aside").classList.add("show")
        document.querySelector(".cart").innerHTML = ''
        

        let subtotal = 0
        let desconto = 0
        let total = 0


        for (let i in cart){
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id)
            let cartItem = document.querySelector(".cart--item").cloneNode(true)
            document.querySelector(".cart").append(cartItem)

            cartItem.querySelector(".cart--item img").src = pizzaItem.img
            
            subtotal += pizzaItem.price[cart[i].size] * cart[i].qtde

            //construindo nome que aparece no carrinho
            let pizzaSizeName
            if(cart[i].size == 0){
                pizzaSizeName = 'P'
            }else if (cart[i].size == 1){
                pizzaSizeName = 'M'
            }else{
                pizzaSizeName = 'G'
            }
            let cartName = `${pizzaItem.name} (${pizzaSizeName})`
            cartItem.querySelector(".cart--item-nome").innerHTML = cartName

            cartItem.querySelector(".cart--item--qt").innerHTML = cart[i].qtde


            //faz botão de - do carrinho diminuir a quantidade selecionada
            cartItem.querySelector(".cart--item-qtmenos").addEventListener("click",()=>{
                if (cart[i].qtde > 1){ //só diminui até quantidade = 1
                    cart[i].qtde--
                }else{
                    cart.splice(i,1)             
                }
                updateCart()
            })
            //faz botão de + do carrinho aumentar a quantidade selecionada
            cartItem.querySelector(".cart--item-qtmais").addEventListener("click",()=>{
                cart[i].qtde++
                updateCart()
            })


            let qtTotal = 0
            for (j=0;j<cart.length;j++){
                qtTotal += cart[j].qtde
                if (qtTotal >=2){
                    desconto = subtotal * 0.1
                }
            }
            total = subtotal - desconto

            document.querySelector(".subtotal span:last-child").innerHTML = `R$ ${subtotal.toFixed(2)}`
            document.querySelector(".desconto span:last-child").innerHTML = `R$ ${desconto.toFixed(2)}`
            document.querySelector(".total span:last-child").innerHTML = `R$ ${total.toFixed(2)}`


        }
    }else{
        document.querySelector("aside").classList.remove("show")
        document.querySelector("aside").style.left = '100vw'
    }
}
















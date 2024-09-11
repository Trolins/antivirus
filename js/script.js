const elements = []; //змінна масиву елементів із запиту (потрібно для завантаження)
// Функція для GET запиту
 function getData() {
    fetch('https://veryfast.io/t/front_test_api.php')
      .then(response => response.json())
      .then(data => {
        elements.push(...data.result.elements);
        parseData(data.result)
      })
      .catch(error => {
        console.error('Помилка:', error);
      });
 }

 //Розбираємо отриманий масив і збираємо html
 function parseData (result) {
        console.log(result);
        const itemList = document.getElementById('itemList');

        result.elements.slice(0, 3).forEach(item => {
            const li = document.createElement('li');
            li.classList.add('item');
        
            let best_price = ''
        
            if (item.is_best) {
                best_price += `<div class="price best">
                                    <div class="best-value">
                                        <p>Best value</p>
                                    </div>
                                        <p>${item.amount}<span>/per year</span></p>
                                </div>`
            } else if (item.amount_html) {  //Немає параметра який показує, що є діскаунт, тому взяв поле amount_html, бо в елементах без діскаунта його немає
                best_price += `<div class="price discount">
                                    <div class="disc-img">
                                        <p>${item.price_key}</p>
                                    </div>
                                    <p>${item.amount}<span>/mo</span></p>                                    
                                    <p class="off">${parseLine(item.amount_html)}</p>
                                </div>`
            } else {
                best_price += `<div class="price">
                                    <p>${item.amount}<span>/per year</span></p>
                                </div>`
            }
           
            li.innerHTML = `${best_price}              
            <div class="name">
              <p>${item.name_prod}</p>
              <span>${item.license_name}</span>
            </div>
            <div class="download">
              <button onclick="downloadFile('${item.product_key}')">
                <span>Download</span>
                <img src="img/download.png" alt="#">
              </button>
            </div>`;
            itemList.appendChild(li);
        })
 }

 // Завантаження файлу (через невидимий лінк)
 function downloadFile (key) {
    var link = document.createElement('a');
    elements.forEach(el => {
        if (el.product_key == key) {         
            link.href = el.link;
            link.download = 'product_key.exe';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => {
                getBrowserInfo();
                document.body.classList.add('animating');
            }, 1500);
        }
    });
 }

 // Визначення браузера 
 function getBrowserInfo() {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Firefox")) {
        document.getElementById('downloadIcon').classList.add('firefox');
        setTimeout(document.body.classList.remove('animating'), 2500)
    } else {
        document.getElementById('downloadIcon').classList.add('chrome');
        setTimeout(document.body.classList.remove('animating'), 2500)
    }
    resetAnimation();
}
// Оновлення анімації анімованого блока
 function resetAnimation () {
    let el = document.getElementById('downloadIcon');
    el.style.display = 'none';
    el.style.display = 'block';
    el.style.animation = 'none'; 
    el.offsetHeight; 
    el.style.animation = ''; 
 }

 //Непотрібна функція, просто в запиті не приходить параметр старої ціни окремо, для елемента з діскаунтом
 function parseLine (line) {
    // Регулярний вираз для знаходження тексту між $ і </strike>
    const regex = /\$(.*?)<\/strike>/;
    const price = line.match(regex);

    if (price) {
        return price[1]; // Повертає перше захоплене підрядок (текст між $ і </strike>)
    } else {
        return null; // Якщо немає збігів
    }
 }
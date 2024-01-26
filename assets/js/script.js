const getData = async() => {
    try {
        const resp = await fetch('https://mindicador.cl/api')
        const dataValues = await resp.json()
        const arrayValues = Object.values(dataValues).filter((e) => e.unidad_medida == "Pesos") // conv array y filter x Pesos
        
        // render template de data filter (array)
        renderSelect(arrayValues)
        return arrayValues
    } catch (error) {
        // console.error("error:", error.message);
        document.getElementById('moneda').innerHTML = `<option>Algo salio mal 🤪: ${error.message}</option>`;
    }

}

const renderSelect = (data) => {
    
    let template = '<option hidden>Seleccione moneda</option>';
    data.forEach((e) => {
        template += `
        <option value="${e.valor}" id="${e.codigo}">${e.codigo}</option>`
    })
    document.getElementById("moneda").innerHTML = template
}

getData()

const btnCalculate = document.getElementById('btn-search')
const inputValues = document.getElementById('monto')
const selectMoneda = document.getElementById('moneda');

let chartjs = ''
btnCalculate.addEventListener('click', async() => {
    
    const inputValue = Number(inputValues.value); 
    const selectedMonedaValue = Number(selectMoneda.value)
    const selectedIndex = selectMoneda.selectedIndex // index option
    const selectedOption = selectMoneda.options[selectedIndex]; //collection options, paso el index
    const kind = selectedOption.id; 

    // console.log(selectedMonedaValue);
    // console.log(inputValue);
    // console.log(kind);

    if (!isNaN(inputValue) && !isNaN(selectedMonedaValue) && inputValue > 0) {

        const conversion = inputValue / selectedMonedaValue
        // inputValues.value = ''
        
        document.getElementById('valor-convertido').textContent = conversion.toFixed(2);

        (chartjs) ? chartjs.destroy() : ''
        const dataApi = await getDate(kind)
        const config = configData(dataApi)
        const chartDom = document.getElementById('grafico')
        chartjs = new Chart(chartDom, config)

    }else{
        alert("Debes colocar valores validos")
    }

});
// fechas
const getDate = async(tipoIndicador) => {
    try {

        const url = `https://mindicador.cl/api/${tipoIndicador}`
        const response = await fetch(url);
        const data = await response.json()

        const datafilter = data.serie
        // console.log(datafilter);
        
        return datafilter
      
    } catch (error) {
        console.log(error.message);
    }

}

// config render chart
const configData = (dataApi) => {

    const orderDate = dataApi.sort((a,b) => new Date(a.fecha) - new Date(b.fecha))

    const ejeX = orderDate.map((x) => x.fecha.split('T')[0]).slice(-10)
    const ejeY = orderDate.map((y) => y.valor).slice(-10)
    // console.log(ejeX);

    const config = {
        type: 'line',
        data: {
            labels: ejeX,
            datasets: [{
                label: `Historial de los ultimos 10 dias`,
                backgroudColor: 'red',
                data: ejeY
            }]
        }
    }
    return config;
}











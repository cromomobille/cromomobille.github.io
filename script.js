function download() {
  let data = JSON.stringify({ treatments: dados })
  let type = "text/json"
  let filename = "protocolos.json"

  var file = new Blob([data], {type: type});
  if (window.navigator.msSaveOrOpenBlob) // IE10+
      window.navigator.msSaveOrOpenBlob(file, filename);
  else { // Others
      var a = document.createElement("a"),
              url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function() {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);  
      }, 0); 
  }
}

var ProtocolBase = `
  <div class="protocol" id="protocol_#PROTOCOL_INDEX#">
    <input 
      type="text" 
      id="title_#PROTOCOL_INDEX#" 
      class="title-protocol" placeholder="Protocolo" value="#PROTOCOL_TITLE#"
      onChange="ChangeProtocol(#PROTOCOL_INDEX#)"
    >

    <button
      class="button button-red"
      onclick="DeleteProtocol(#PROTOCOL_INDEX#)"
    >
      Excluir
    </button>

    <button
      class="button button-green button-full"
      onclick="AddChackra(#PROTOCOL_INDEX#)"
    >
      Adicionar Chackra
    </button>
  </div>
`;

function Protocol(protocol_title, protocol_index) {
  let result = ProtocolBase
  result = result.replaceAll("#PROTOCOL_TITLE#", protocol_title)
  result = result.replaceAll("#PROTOCOL_INDEX#", protocol_index)
  return result
};

var GroupChackraBase = `
  <div class="group-chackras" id="group_chackra_#PROTOCOL_INDEX#_#CHACKRA_INDEX#">
    <input 
      type="text" 
      id="chackra_#PROTOCOL_INDEX#_#CHACKRA_INDEX#" 
      class="title-chackra" 
      placeholder="Local / Chackra" 
      value="#CHACKRA_TITLE#"
      onChange="ChangeChackra(#PROTOCOL_INDEX#, #CHACKRA_INDEX#)"
    >

    <button
      class="button button-red"
      onclick="DeleteChackra(#PROTOCOL_INDEX#, #CHACKRA_INDEX#)"
    >
      Excluir
    </button>

    <button
      class="button button-green button-full"
      onclick="AddColor(#PROTOCOL_INDEX#, #CHACKRA_INDEX#)"
    >
      Adicionar Cor
    </button>
  </div>
`

function GroupChackra(chackra_title, protocol_index, chackra_index) {
  let result = GroupChackraBase
  result = result.replaceAll("#CHACKRA_TITLE#", chackra_title)
  result = result.replaceAll("#PROTOCOL_INDEX#", protocol_index)
  result = result.replaceAll("#CHACKRA_INDEX#", chackra_index)

  return result
}

var GroupColorBase = `
  <div class="group-colors">
    <select 
      id="color_#PROTOCOL_INDEX#_#CHACKRA_INDEX#_#COLOR_INDEX#" placeholder="Cor"
      onChange="ChangeColor(#PROTOCOL_INDEX#, #CHACKRA_INDEX#, #COLOR_INDEX#)"
    >
      <option value="red" red-selected>Vermelho</option>
      <option value="blue" blue-selected>Azul Indígo</option>
      <option value="orange" orange-selected>Laranja</option>
      <option value="yellow" yellow-selected>Amarelo</option>
      <option value="sky" sky-selected>Azul Claro</option>
      <option value="green" green-selected>Verde</option>
      <option value="violet" violet-selected>Violeta</option>
    </select>

    <input 
      type="text" 
      id="time_#PROTOCOL_INDEX#_#CHACKRA_INDEX#_#COLOR_INDEX#" class="time-select" 
      placeholder="Tempo" 
      value="#TIME#"
      onChange="ChangeTime(#PROTOCOL_INDEX#, #CHACKRA_INDEX#, #COLOR_INDEX#)"
    >

    <button 
      class="button button-red"
      onclick="DeleteColor(#PROTOCOL_INDEX#, #CHACKRA_INDEX#, #COLOR_INDEX#)"
    >
      Excluir
    </button>
  </div>
`

var ButtonAddProtocol = `
  <button class="button button-green" onclick="AddProtocol()">Adicionar Protocolo</button>
`


function GroupColor(color, time, protocol_index, chackra_index, color_index) {
  let result = GroupColorBase
  result = result.replaceAll("#COLOR#", color)
  result = result.replaceAll("#TIME#", time)
  result = result.replaceAll("#PROTOCOL_INDEX#", protocol_index)
  result = result.replaceAll("#CHACKRA_INDEX#", chackra_index)
  result = result.replaceAll("#COLOR_INDEX#", color_index)

  result = result.replaceAll(`${color}-selected`, 'selected')

  return result
}

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

var dados = JSON.parse(httpGet("https://cromomobille.github.io/protocolos.json"))

dados = dados.treatments
//dados = [dados[1]]

function RenderData() {
  document.getElementById("content").innerHTML = ButtonAddProtocol

  dados.map(( protocol, protocol_index ) => {
    let protocolItem = Protocol(protocol.title, protocol_index)

    document.getElementById("content").innerHTML += protocolItem

    protocolItem = document.getElementById(`protocol_${protocol_index}`)

    protocol.chackras.map(( chackra, chackra_index ) => {
      let chackraItem = GroupChackra(chackra.name, protocol_index, chackra_index)

      protocolItem.innerHTML += (chackraItem)

      chackraItem = document.getElementById(`group_chackra_${protocol_index}_${chackra_index}`)

      chackra.colors.map((color, color_index) => {
        let colorItem = GroupColor(color.color, color.time, protocol_index, chackra_index, color_index)

        chackraItem.innerHTML += (colorItem)
      })
    })  
  })  
}

function AddProtocol() {
  Status("Protocolo Adicionado")
  dados.push(
    {
      title: "",
      editable: false,
      chackras: [
        {
          name: "",
          colors: [
            {
              color: "red",
              time: 60
            }
          ]
        }
      ]     
    }
  )

  RenderData()
}

function AddChackra(protocol_index) {
  Status(`Chackra Adicionada: ${protocol_index}`)
  dados[protocol_index].chackras.push(
    {
      name: "",
      colors: [
        {
          color: "red",
          time: 60
        }
      ]
    }
  )

  RenderData()
}

function AddColor(protocol_index, chackra_index) {
  Status(`Cor Adicionada: ${protocol_index}-${chackra_index}`)
  dados[protocol_index].chackras[chackra_index].colors.push(
    {
      color: "red",
      time: 60
    }
  )

  RenderData()
}

function DeleteColor(protocol_index, chackra_index, color_index) {
  Status(`Cor Excluida: ${protocol_index}-${chackra_index}-${color_index}`)  
  delete dados[protocol_index].chackras[chackra_index].colors[color_index]

  RenderData()
}

function DeleteChackra(protocol_index, chackra_index) {
  Status(`Chackra Excluido: ${protocol_index}-${chackra_index}`)
  delete dados[protocol_index].chackras[chackra_index]

  RenderData()
}

function DeleteProtocol(protocol_index) {
  Status(`Protocolo Excluido: ${protocol_index}`)
  delete dados[protocol_index]

  RenderData()
}

function ChangeProtocol(protocol_index) {
  Status(`Protocolo Alterado: ${protocol_index}`)

  let value = document.getElementById(`title_${protocol_index}`).value
  dados[protocol_index].title = value

  RenderData()
}

function ChangeChackra(protocol_index, chackra_index){
  Status(`Chackra Alterado: ${protocol_index}-${chackra_index}`)

  let value = document.getElementById(`chackra_${protocol_index}_${chackra_index}`).value
  dados[protocol_index].chackras[chackra_index].name = value
  
  RenderData()
}

function ChangeColor(protocol_index, chackra_index, color_index){
  Status(`Cor Alterado: ${protocol_index}-${chackra_index}-${color_index}`)

  let value = document.getElementById(`color_${protocol_index}_${chackra_index}_${color_index}`).value
  dados[protocol_index].chackras[chackra_index].colors[color_index].color = value

  RenderData()
}

function ChangeTime(protocol_index, chackra_index, color_index){
  Status(`Tempo Alterado: ${protocol_index}-${chackra_index}-${color_index}`)

  let value = document.getElementById(`time_${protocol_index}_${chackra_index}_${color_index}`).value
  dados[protocol_index].chackras[chackra_index].colors[color_index].time = value

  RenderData()
}

function Status(text) {
  document.getElementById("status").innerText = text
}

RenderData()
Status("Dados Carregados")
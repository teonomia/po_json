const PoJson = require('./PoJson')
const F = require('./File')
const cwdPath = process.cwd()
function cwd (path) {return `${cwdPath}/src/${path}`}
const HTML = require('node-html-parser')


describe('PO para JSON', () => {
  jest.resetModules()
  it('modelo de body com id, str e comment', async () => {
    expect.assertions(5)
    const poPoBuff = await F.rf(cwd('data.test/po.po')); const poPo = poPoBuff.toString()
    const returnedPoJson = PoJson.fromPo(poPo)
    F.wf(cwd('data.test/po2poJson.json'),returnedPoJson.toString)

    expect(returnedPoJson.body[1].id).toBeDefined()
    expect(returnedPoJson.body[1].id[0]).toBeDefined()
    expect(returnedPoJson.body[1].str).toBeDefined()
    expect(returnedPoJson.body[1].str[0]).toBeDefined()
    expect(returnedPoJson.body[1].comment).toBeDefined()
  })
  it('Modelo de body com header id', async () => {
    expect.assertions(4)
    const poPoBuff = await F.rf(cwd('data.test/bodyHeader/jsonParsed_copy.po')); const poPo = poPoBuff.toString()
    const returnedPoJson = PoJson.fromPo(poPo)
    expect(returnedPoJson.body[0].id).toBeDefined()
    expect(Array.isArray(returnedPoJson.body[0].id.title)).toBeDefined()
    expect(returnedPoJson.body[0].str).toBeDefined()
    expect(returnedPoJson.body[0].comment).toBeDefined()
  })
})

describe('PoJSON para PO', () => {
  jest.resetModules()
  it('Modelo da estrutura do po', async () => {
    expect.assertions(1)
    const poJsonBuff = await F.rf(cwd('data.test/poJson.json')); const poJsonS = poJsonBuff.toString()
    const returnedPo = new PoJson(poJsonS).po
    F.wf(cwd('data.test/poJson2po.po'),returnedPo)
    const splitedReturnedPo = returnedPo.split('\n\n')
    expect(splitedReturnedPo[1]).toBeDefined()
  })
  it('PO com body Header', async () => {
    expect.assertions(1)
    const poJsonBuff = await F.rf(cwd('data.test/bodyHeader/json.json')); const poJsonS = poJsonBuff.toString()
    const returnedPo = new PoJson(poJsonS).po
    F.wf(cwd('data.test/bodyHeader/json_to_po.po'),returnedPo)
    const poJsonFromPo = PoJson.fromPo(returnedPo)
    expect(poJsonFromPo.body[0].id.title).toBeDefined()
  })
})

describe('HTML para PoJSON', () => {
  jest.resetModules()
  it('Modelo da estrutura html para poJson', async () => {
    expect.assertions(4)
    const htmlBuff = await F.rf(cwd('data.test/article.html')); const htmlS = htmlBuff.toString()
    const returnedPoJson = PoJson.fromHtml(htmlS)
    F.wf(cwd('data.test/articleHtml.json'),returnedPoJson.string)

    expect(returnedPoJson.body[0].id).toBeDefined()
    expect(returnedPoJson.body[0].str).toBeDefined()
    expect(returnedPoJson.body[0].comment).toBeDefined()
    expect(returnedPoJson.body[0].comment).toMatch(/^##HTML:/g)
  })

  it('Verifica se arquivo está sendo criado com quebra de linas', async ()=>{
    expect.assertions(2)
    const htmlBuff = await F.rf(cwd('data.test/article.html')); const htmlS = htmlBuff.toString()
    const returnedPoJson = PoJson.fromHtml(htmlS)
    expect(returnedPoJson.body[0].id).toBeDefined()
    // Verify if the archive is breaking te line (there is a bug that fromHTML doesn't create mutiple lines )
    expect(returnedPoJson.body[1].id.length).toBeGreaterThan(1)
  })
  
})

describe('PoJSON para HTML', () => {
  jest.resetModules()
  it('modelo da estrutura do poJson', async () => {
    expect.assertions(3)
    const jsonBuff = await F.rf(cwd('data.test/articleHtml.json')); const jsonS = jsonBuff.toString()
    const returnedJsonHtmlString = new PoJson(jsonS).html

    const HTMLElement = HTML.parse(returnedJsonHtmlString)

    F.wf(cwd('data.test/json.html'),returnedJsonHtmlString)

    expect(HTMLElement.querySelector('article').tagName).toBe('article')
    expect(HTMLElement.querySelector('div').tagName).toBe('div')
    expect(HTMLElement.querySelector('p').tagName).toBe('p')
  })
})

describe('Generating info', () => {
  jest.resetModules()
  it('Test if all informations are being Created', async () => {
    expect.assertions(7)
    const jsonBuff = await F.rf(cwd('data.test/8-rush.json')); const jsonS = jsonBuff.toString()
    const returnedPoJson = new PoJson(jsonS)
    let recievedObjct = returnedPoJson.generateInfo()
    expect(returnedPoJson._info).toBeDefined()
    expect(returnedPoJson._info.translatedLines).toBeGreaterThan(0) // Expect a file with minimum of 1 line translated
    expect(returnedPoJson._info.totalLines).toBeGreaterThan(0)
    expect(returnedPoJson._info.percentageTranslated).toBeGreaterThan(0) // Expect a file with minimum of 1 line translated
    expect(recievedObjct).toBeDefined()
    expect(recievedObjct.i).toBeDefined()
    expect(recievedObjct.info).toBeDefined()
  })
})

describe('PO rush', () => {
  //jest.resetModules()
  it('4 rush', async () => {
    expect.assertions(2)
    const poPoBuff = await F.rf(cwd('data.test/final-rush-article.po')); const poPo = poPoBuff.toString()
    const returnedPoJson = PoJson.fromPo(poPo)
    //returnedPoJson.toHtml()
    // console.log(returnedPoJson)
    F.wf(cwd('data.test/final-rush-article.json'),returnedPoJson.toString)

    expect(returnedPoJson.body[0].id).toBeDefined()
    expect(returnedPoJson.body[4].id[1]).toBe('	To be prayerless is to regard ourselves as autonomous, and to believe, im')

    // console.log(returnedPoJson.body)
    // expect(returnedPoJson.body[0].id).toBeDefined()
    // expect(returnedPoJson.body[4].id[0]).toBe('	To be prayerless is to regard ourselves as autonomous, and to believe, im')
  })

  it('8 test rushdoony files ', async () => {
    expect.assertions(2)
    const poPoBuff = await F.rf(cwd('data.test/8-rush.po')); const poPo = poPoBuff.toString()
    const returnedPoJson = PoJson.fromPo(poPo)
    const returnedHtml = PoJson.fromPo(poPo).html
    const returnedHtmlTranslated = PoJson.fromPo(poPo).translatedHtml
    returnedPoJson.toHtml()

    F.wf(cwd('data.test/8-rush.json'),returnedPoJson.toString())

    expect(returnedPoJson.body[0].str).toBeDefined()
    expect(returnedPoJson.body[4].str.length).toBe(1)

    F.wf(cwd('data.test/8-rush-translated.html'),returnedHtmlTranslated)
    F.wf(cwd('data.test/8-rush.html'),returnedHtml)

  })
})

describe('Header well created', () => {
  //jest.resetModules()
  it('test Header 1', async () => {
    expect.assertions(1)
    const jsonBuff = await F.rf(cwd('data.test/bodyHeader/json.json')); const json = jsonBuff.toString()
    const returnedPoJson = new PoJson(json)
    // console.log(returnedPoJson.body[2])
    F.wf(cwd('data.test/bodyHeader/jsonParsed.po'),returnedPoJson.po)
    expect(returnedPoJson.body[0].id).toBeDefined()
  })

  it('test Header 2', async () => {
    expect.assertions(1)
    const poBuff = await F.rf(cwd('data.test/bodyHeader/jsonParsed_copy.po')); const po = poBuff.toString()
    //console.log(po)
    let returnedPoJson
    try{
      returnedPoJson = PoJson.fromPo(po)
      F.wf(cwd('data.test/bodyHeader/jsonParsed_to_json.json'),returnedPoJson.string)
    } catch(e){
      console.log(e)
      F.wf(cwd('data.test/bodyHeader/jsonParsed_to_json.json'),'error')
    }
    expect(returnedPoJson.body[0].id).toBeDefined()
  })

})
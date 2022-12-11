/**
 * 获取卦象数据
 * @returns {Promise<Array>}
 */
function getData() {
  return new Promise((resolve, reject) => {
    fetch("./data.json")
      .then((res) => {
        if (res.status === 200) {
          res
            .json()
            .then((data) => {
              data.gua.forEach((item, index) => {
                data.gua[index].baike = encodeURI(
                  `https://baike.baidu.com/item/${item["gua-name"]}卦`
                );
              });
              resolve(data.gua);
            })
            .catch((e) => {
              reject(e);
            });
        } else {
          reject(res);
        }
      })
      .catch((e) => {
        reject(e);
      });
  });
}

/**
 * 生成 0 或者 1
 * @returns {0|1}
 */
function generateZeroOrOne() {
  const num = Math.random();
  if (num === 0.5) {
    return generateGua();
  } else {
    return num < 0.5 ? 0 : 1;
  }
}

/**
 * 生成卦象数组
 * @returns {Array<number>}
 */
function generateGua() {
  const count = 5;
  const list = [];
  for (let index = 0; index <= count; index++) {
    const num = generateZeroOrOne();
    list.push(num);
  }

  console.log("卦象", list);
  return list;
}

/**
 * 获取卦象数据
 * @param {Array} guas
 * @param {Array} list
 */
function getGuaDetail(guas, list) {
  const guaXiang = list.join("");
  const current = guas.filter((item) => item["gua-xiang"] === guaXiang)[0];

  console.log("详情", current);
  return current;
}

/**
 * 使用 canvas 绘制卦象
 * @param {Array} list
 * @param {HTMLCanvasElement} cav
 */
function draw(list, cav, width = 100, height = 130) {
  cav.width = width;
  cav.height = height;
  const ctx = cav.getContext("2d");
  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = "black";
  list.forEach((item, index) => {
    if (item) {
      // 1
      ctx.fillRect(10, 10 + (list.length - index) * 20, 80, 10);
    } else {
      // 0
      ctx.fillRect(10, 10 + (list.length - index) * 20, 35, 10);
      ctx.fillRect(55, 10 + (list.length - index) * 20, 35, 10);
    }
  });
}

/**
 *
 * @param {HTMLSpanElement} name
 * @param {HTMLSpanElement} guaDetail
 * @param {HTMLSpanElement} yaoDetail
 * @param {HTMLLinkElement} baike
 * @param {Object} current
 */
function fillText(name, guaDetail, yaoDetail, baike, current) {
  name.innerHTML = current["gua-name"] + "卦";
  guaDetail.innerHTML = current["gua-detail"];
  yaoDetail.innerHTML = current["yao-detail"].join("");
  baike.href = current["baike"];
  baike.innerHTML = "百度百科详解";
}

/**
 * 初始化函数
 */
async function init() {
  const btn = document.querySelector("#btn");
  const cav = document.querySelector("#cav");
  const name = document.querySelector("#name");
  const guaDetail = document.querySelector("#gua-detail");
  const yaoDetail = document.querySelector("#yao-detail");
  const baike = document.querySelector("#baike");

  cav.height = 0;

  const gua = await getData();
  if (gua) {
    btn.addEventListener("click", () => {
      const list = generateGua();
      const current = getGuaDetail(gua, list);
      //   绘图
      draw(list, cav);
      // 填充文本
      fillText(name, guaDetail, yaoDetail, baike, current);
    });
  } else {
    alert("获取卦象数据失败");
  }
}

init();

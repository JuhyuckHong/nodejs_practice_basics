const express = require("express")
const router = express.Router()



router.get("/goods", (req, res) => {
    res.status(200).json({ goods })
})

//상품 상세 조회 API
router.get("/goods/:goodsId", (req, res) => {
    const { goodsId } = req.params

    let good = null
    good = goods.filter((val) => val.goodsId === Number(goodsId) ? val : null)

    console.log(good)
    res.status(200).json({ "detail": good })
})

const Goods = require("../schemas/goods.js");
router.post("/goods/", async (req, res) => {
    const { goodsId, name, thumbnailUrl, category, price } = req.body;

    console.log(goodsId, name, thumbnailUrl, category, price)

    const goods = await Goods.find({ goodsId });
    if (goods.length) {
        return res.status(400).json({ success: false, errorMessage: "이미 있는 데이터입니다." });
    }

    const createdGoods = await Goods.create({ goodsId, name, thumbnailUrl, category, price });

    res.json({ goods: createdGoods });
});


const Cart = require("../schemas/cart");
router.post("/goods/:goodsId/cart", async (req, res) => {
    const { goodsId } = req.params;
    const { quantity } = req.body;

    const existsCarts = await Cart.find({ goodsId: Number(goodsId) });
    if (existsCarts.length) {
        return res.json({ success: false, errorMessage: "이미 장바구니에 존재하는 상품입니다." });
    }

    await Cart.create({ goodsId: Number(goodsId), quantity: quantity });

    res.json({ result: "success" });
});

router.put("/goods/:goodsId/cart", async (req, res) => {
    const { goodsId } = req.params;
    const { quantity } = req.body;

    const existsCarts = await Cart.find({ goodsId: Number(goodsId) });
    if (existsCarts.length) {
        await Cart.updateOne({ goodsId: Number(goodsId) }, { $set: { quantity } });
    }

    res.json({ success: true });
})

router.delete("/goods/:goodsId/cart", async (req, res) => {
    const { goodsId } = req.params;

    const existsCarts = await Cart.find({ goodsId });
    if (existsCarts.length > 0) {
        await Cart.deleteOne({ goodsId });
    }

    res.json({ result: "success" });
});

module.exports = router
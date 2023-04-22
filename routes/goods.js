const express = require("express")
const router = express.Router()
const Cart = require("../schemas/cart");
const Goods = require("../schemas/goods.js");

router.get("/goods", (req, res) => {
    res.status(200).json({ goods })
})

// 장바구니 조회 API
router.get("/cart", async (req, res) => {
    const carts = await Cart.find({});
    const goodsIds = carts.map((cart) => cart.goodsId);

    const goods = await Goods.find({ goodsId: goodsIds });

    const results = carts.map((cart) => {
        return {
            quantity: cart.quantity,
            goods: goods.find((item) => item.goodsId === cart.goodsId)
        };
    });

    res.json({
        carts: results,
    });
});

// 상품 상세 조회 API
router.get("/goods/:goodsId", (req, res) => {
    const { goodsId } = req.params

    let good = null
    good = goods.filter((val) => val.goodsId === Number(goodsId) ? val : null)

    console.log(good)
    res.status(200).json({ "detail": good })
})

// 물품 등록
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


// 장바구니에 물품 담기
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

// 장바구니에 담긴 물품 수량 수정
router.put("/goods/:goodsId/cart", async (req, res) => {
    const { goodsId } = req.params;
    const { quantity } = req.body;

    console.log("quantity", quantity, typeof (quantity))

    if (quantity < 1) {
        console.log("detected")
        return res.status(400).json({})
    }

    const existsCarts = await Cart.find({ goodsId: Number(goodsId) });
    if (existsCarts.length) {
        await Cart.updateOne({ goodsId: Number(goodsId) }, { $set: { quantity } });
    }

    res.json({ success: true });
})

// 장바구니에 물품 빼기
router.delete("/goods/:goodsId/cart", async (req, res) => {
    const { goodsId } = req.params;

    const existsCarts = await Cart.find({ goodsId });
    if (existsCarts.length > 0) {
        await Cart.deleteOne({ goodsId });
    }

    res.json({ result: "success" });
});

module.exports = router
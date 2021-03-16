const express = require('express');
const router = express.Router();
const { unlink } = require('fs');
const { Post } = require('../models/Post');
const sanitizeHtml = require('sanitize-html');

//모델에있는 스키마를 가져온다

//route는 ctrl.js와 같은 기능구현이 돼있다
/*=================================
              Posts
=================================*/

// page에서 add한 image를 server upload/products 폴더에 저장

const sanitizeOption = {
    allowedTags: ['h1', 'h2', 'b', 'i', 'u', 's', 'p', 'ul', 'ol', 'li', 'blockquote', 'a', 'img'],
    allowedAttributes: {
        a: ['href', 'name', 'target'],
        img: ['src'],
        li: ['class'],
    },
    allowedSchemes: ['data', 'http'],
};

router.post('/write', (req, res) => {
    const { title, body, tags, userId } = req.body;
    console.log('글내용', sanitizeHtml(body));

    const post = new Post({ title, body, tags, userId });
    post.save((err) => {
        //post로 저장할땐 이런save방식을 써야한다
        if (err) {
            return res.status(400).json({ success: false, err }); //400에러에대한코드  .해줘야 에러발생했을때 console에 뜸
        }
        res.status(200).json({ success: true });
    });
});

router.get('/list', (req, res) => {
    Post.find()
        .populate('userId')
        .exec((err, postlist) => {
            if (err) {
                return res.status(400).json({ success: false, err }); //400에러에대한코드  .해줘야 에러발생했을때 console에 뜸
            }
            console.log('포스트불러d왔어어떻게?', postlist);
            res.status(200).json({ success: true, postlist });
            console.log('포스트불러왓어@@@@@@@@@@@@@글쎄어떻게?', postlist);
        });
});

// /api/posts/list/:id
router.get('/list/:id', (req, res) => {
    console.log('쿼리', req.query);
    Post.findOne({ title: req.query })
        .populate('userId')
        .exec((err, postlist) => {
            if (err) {
                console.log('여기까지왓니?');
                return res.status(400).json({ success: false, err }); //400에러에대한코드  .해줘야 에러발생했을때 console에 뜸
            }
            res.status(200).json({ success: true, postlist });
            console.log('성공여기까지왓니?dddd', postlist);
        });
});

//     if (!ObjectId.isValid(id)) {
//       ctx.status = 400; // Bad Request
//       return;
//     }
//     try {
//       const post = await Post.findById(id);
//       // 포스트가 존재하지 않을 때
//       if (!post) {
//         ctx.status = 404; // Not Found
//         return;
//       }
//       ctx.state.post = post;
//       return next();
//     } catch (e) {
//       ctx.throw(500, e);
//     }
//   };

module.exports = router;

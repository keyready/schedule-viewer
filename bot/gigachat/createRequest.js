const sendMessage = async (messages) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

    console.log(messages);

    const answer = await fetch('https://gigachat.devices.sberbank.ru/api/v1/chat/completions', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization':
                'Bearer eyJjdHkiOiJqd3QiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwiYWxnIjoiUlNBLU9BRVAtMjU2In0.WtdVpUKoY9tjHr1hZ3LEw0DWvyH4VKYJByArUiFNr3Q1424mK-MGKC6ljAbxlY7zWUtxWSVDOUYCfYGoaED99brIHFPEZJoWch1zpBpyoZjWMMaNS2iBcgiy63FYiVw46Y1pOfBpH1WEVFqFZ2UhFDGD5_T0MO0sIgRJa-FcItZvNwy_yaSVB_BSxPIs3isXqLH-6fbeRJmbFQOH67bwZeVoMBo37MHpT0AIqSGfub8Q25SEQ37siDj2_6dqQHlABsSj24XY0S5Z2DND4aEFe_FsjSQKPQdFa2H5_RWY7-LjDVqCAWoemVGCrELMUIOwEJlkTxQC8s-H72VIMbRTlA.mKJgVz4Hs4nVB4HogJyVBw.3fOSgrW_qqZHvws7VPe1R-wVlQQ3Wzg9Wq4mi3RzvCdLDRX7ppujDrAeBT4Ygn75NeVEvXlFWgEvnMv7O7o8Mx_0BxTc9UhlZutnai9MYjx2i66_Tc1j3AEtTLiLW_OPdYrGEEbvH_J6PjT2GQ2QuwfToNWFXxHKjeNOOL_rw25D_aO6etpeVKICA1yDYj5tlzboRmTnBJzoJ2xHvjpjNtDiifd2SMql69J7fX_ZYZksC2vj8jOUYw21KugHS5zGhBnWodK9yPGNaeuT0zyJ3K1hK0wPp6_YSKFDFfy2pbaKxlAJP9kDTD3teO4RUJLJGccnQKWiALxMENcbImX8aBHXrz6MBgwA2G7Hv6b9LiC2ssDOGzFIoVDmlWBDewf1U-E8ySZ06o3qCALgCJT0fmDs-FfW_hbC4i6ijRpf-o8xLi06oZdqmN7mIBwfIyJ2ztkTqfcIJlYIgmlqCXTxn8g5mM4r2uxIqffuDRNSL5Y529BREjR3_sOuMN3QYSSijQSy8l5CGfmJOAriykyGIWLPBP1Aaue_E9q1lhhzV1wZhXFTb0KUx8obqtf7xixMuJdPMotYDbPfF6RyVB65_23TTDxWYnqNPchpvsTs1AWq8Kj8_8xQBvoZRqOGyqYpYqvs-qTAE27O1T6k9UNYN32B2FO8RtNiMxxra8HbeYcnJGwUPjo8y1davLM3HCIBMP2xrRz1lSYK_I8sem32EAQaJ7r30PcdywZ5xpqXtu8.eLMo0oAS_556xcKGP1-rDa8TTNnKP5CsLPQqhJG4-hE',
            'rejectUnauthorized': false,
        },
        body: JSON.stringify({
            model: 'GigaChat:latest',
            messages,
            temperature: 0.7,
        }),
    });

    const jsonAnswer = await answer.json();
    return jsonAnswer.choices[0].message.content;
};

module.exports = {
    sendMessage,
};

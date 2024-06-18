// Copy everything


// 指定图片格式，默认格式（未指定或不支持）为 image/png
const type = 'image/png'

// 当请求图片格式为 image/jpeg 或者 image/webp 时用来指定图片展示质量
const quality = 1

// prompt maps
const promptMap = new Map([
    [0, 'Unable to copy to clipboard!'], // 无法复制到剪贴板
    [1, 'Copy successfully to Clipboard!'], // 成功复制到剪贴板!
    [2, "Can't get picture data!"], // 无法获取图片数据!
    [3, "Failed to load picture!"], // 加载图片失败
])

// tags
const tags = new Map([
    [0, "IMG"]
]);


// 类方法
class v_co {
    constructor() {
        this.type = type;
        this.quality = quality;
    }

    // Copy text
    async txt(text) {
        return new Promise(async (resolve, reject) => {
            if (text !== undefined && text !== null && text !== '') {
                try {
                    await navigator.clipboard.writeText(text);
                    console.log(promptMap.get(1));
                    resolve(promptMap.get(1))
                } catch (err) {
                    console.error(promptMap.get(0), err);
                    reject(promptMap.get(0), err)
                }
            } else {
                reject(promptMap.get(0))
            }
        })
    }

    // Copy image
    // Cross-domain is not supported
    async pic(imageUrl) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous'; // 如果图片跨域，需要设置跨域属性

            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                // 将 Canvas 上的内容转为 Blob 数据
                // https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/toBlob#quality
                canvas.toBlob(async (blob) => {
                    if (!blob) {
                        console.log(promptMap.get(2));
                        reject(new Error(promptMap.get(2)));
                        return;
                    }
                    // 使用 Clipboard API 将图片数据写入剪贴板
                    try {
                        await navigator.clipboard.write([
                            new ClipboardItem({
                                [blob.type]: blob
                            })
                        ]);
                        console.log(promptMap.get(1));
                        resolve(promptMap.get(1));
                    } catch (err) {
                        console.error(promptMap.get(0), err);
                        reject(promptMap.get(0), err);
                    }

                }, this.type, this.quality);
            };

            img.onerror = (error) => {
                console.error(promptMap.get(3), error);
                reject(error);
            };

            img.src = imageUrl;
        })
    }

    // Multigraph replication
    async multi(id) {
        return new Promise(async (resolve, reject) => {
            document.addEventListener("DOMContentLoaded", () => {
                const article = document.getElementById(id);
                // 添加点击事件委托
                article.addEventListener("click", async (event) => {
                    const clickedElement = event.target;
                    // 确保点击的是图片元素
                    if (clickedElement.tagName === tags.get(0)) {
                        try {
                            const imageUrl = clickedElement.src;

                            // 获取图片 Blob 数据
                            const response = await fetch(imageUrl);
                            const blob = await response.blob();

                            // 创建一个新的 Blob 对象，将类型设为 'image/png'
                            const pngBlob = new Blob([blob], { type: type });

                            // 使用 Clipboard API 将图片写入剪贴板
                            await navigator.clipboard.write([
                                new ClipboardItem({
                                    'image/png': pngBlob,
                                }),
                            ]);

                            console.log(promptMap.get(1));
                            resolve(promptMap.get(1))
                        } catch (error) {
                            console.error(promptMap.get(0), error);
                            reject(promptMap.get(0), error)
                        }
                    }
                });
            });
        })
    }

}

export default new v_co();
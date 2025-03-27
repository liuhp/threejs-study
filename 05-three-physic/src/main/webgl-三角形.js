/** @type {HTMLCanvasElement} */
const canvas = document.querySelector("canvas");
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
const gl = canvas.getContext("webgl");

// 检查 WebGL 上下文
if (!gl) {
    console.error('WebGL not supported');
    throw new Error('WebGL not supported');
}

const vertexShaderSrc = `
    attribute vec4 a_Position;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = 10.0;
    }
`;

const fragmentShaderSrc = `
    precision mediump float;
    void main() {
        gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
    }
`;

// 创建顶点着色器
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSrc);
gl.compileShader(vertexShader);
// 检查编译状态
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error('顶点着色器编译失败:', gl.getShaderInfoLog(vertexShader));
    gl.deleteShader(vertexShader);
}

// 创建片元着色器
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSrc);
gl.compileShader(fragmentShader);
// 检查编译状态
if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error('片元着色器编译失败:', gl.getShaderInfoLog(fragmentShader));
    gl.deleteShader(fragmentShader);
}

// 创建程序对象
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

// 检查链接状态
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('程序链接失败:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    throw new Error('程序链接失败');
}

gl.useProgram(program);
gl.program = program;

// 顶点数据
const vertices = new Float32Array([
  // 第一个点
  0.0, 0.8,  // 顶部顶点
  // 第二个点
  -0.8, -0.8,  // 左下顶点
  // 第三个点
  0.8, -0.8   // 右下顶点
]);

// 创建缓存对象
const vertexBuffer = gl.createBuffer();
// 绑定缓存对象到上下文
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
// 向缓存区写入数据
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

// 获取 a_Position 变量地址
const a_Position = gl.getAttribLocation(gl.program, "a_Position");
// 将缓冲区对象分配给 a_Position 变量
gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

// 允许访问缓存区
gl.enableVertexAttribArray(a_Position);

/*** 绘制 ***/
// 清空画布，并指定颜色
// 在绘制之前设置更明显的背景色
gl.clearColor(0.2, 0.2, 0.2, 1.0); // 设置为深灰色背景
gl.clear(gl.COLOR_BUFFER_BIT);
// 绘制三角形
gl.drawArrays(gl.TRIANGLES, 0, 3);// 设置 canvas 实际渲染分辨率以匹配显示大小



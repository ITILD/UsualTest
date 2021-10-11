/**
 * 三维莫顿编码
 * TODO 比较经纬度拼接字符串速度
 */
class Morton {
  constructor() {}

  /*!
   *  Computes the morton number for three 10-bit integers
   *计算三个整数的莫顿码，每个整数10位，最大1023
   *  \param x  Integer that uses up to 10 bit
   *  \param y  Integer that uses up to 10 bit
   *  \param z  Integer that uses up to 10 bit
   *
   *  \return   The morton number as 32-bit int with 30 bits used.
   */
  // inline uint32_t morton_3d(uint32_t x, uint32_t y, uint32_t z)
  static morton_3d(x, y, z) {
    x = (x | (x << 16)) & 0x030000ff
    x = (x | (x << 8)) & 0x0300f00f
    x = (x | (x << 4)) & 0x030c30c3
    x = (x | (x << 2)) & 0x09249249

    y = (y | (y << 16)) & 0x030000ff
    y = (y | (y << 8)) & 0x0300f00f
    y = (y | (y << 4)) & 0x030c30c3
    y = (y | (y << 2)) & 0x09249249

    z = (z | (z << 16)) & 0x030000ff
    z = (z | (z << 8)) & 0x0300f00f
    z = (z | (z << 4)) & 0x030c30c3
    z = (z | (z << 2)) & 0x09249249

    return x | (y << 1) | (z << 2)
  }

  /*!
   *  Computes the non-interleaved inputs from the given morton number
   *根据给定莫顿码计算非交错输出。
   *  \param x      Output parameter. stores as 10-bit integer
   *  \param y      Output parameter. stores as 10-bit integer
   *  \param z      Output parameter. stores as 10-bit integer
   *  \param input  Input morton number with 30 bits. The two most significant
   *                bits must be 0.
   */
  // inline void inverse_morton_3d(uint32_t& x, uint32_t& y, uint32_t& z, uint32_t input)
  static inverse_morton_3d(input) {
    let x = input & 0x09249249
    let y = (input >> 1) & 0x09249249
    let z = (input >> 2) & 0x09249249

    x = ((x >> 2) | x) & 0x030c30c3
    x = ((x >> 4) | x) & 0x0300f00f
    x = ((x >> 8) | x) & 0x030000ff
    x = ((x >> 16) | x) & 0x000003ff

    y = ((y >> 2) | y) & 0x030c30c3
    y = ((y >> 4) | y) & 0x0300f00f
    y = ((y >> 8) | y) & 0x030000ff
    y = ((y >> 16) | y) & 0x000003ff

    z = ((z >> 2) | z) & 0x030c30c3
    z = ((z >> 4) | z) & 0x0300f00f
    z = ((z >> 8) | z) & 0x030000ff
    z = ((z >> 16) | z) & 0x000003ff

    return [x, y, z]
  }
}

export { Morton }

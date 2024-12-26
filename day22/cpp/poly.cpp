#include <NTL/GF2X.h>
#include <iostream>
#include <stdint.h>
#include <fstream>
#include <string>

uint64_t hash(uint64_t n) {
    n = (n ^ (n << 6)) & 0xFFFFFF;
    n = (n ^ (n >> 5)) & 0xFFFFFF;
    n = (n ^ (n << 11)) & 0xFFFFFF;
    return n;
}

// https://www.codeproject.com/Articles/5265915/XorShift-Jump-101-Part-2-Polynomial-Arithmetic
void get_poly() {
    NTL::vec_GF2 vf(NTL::INIT_SIZE, 48);

    uint64_t n = 1;
    for (int i = 0; i < 48; i++) {
        n = hash(n);
        vf[i] = n & 1;
    }

    NTL::GF2X poly;
    NTL::MinPolySeq(poly, vf, 24);

    // std::cout << poly << std::endl; 
    // [1 0 1 1 1 0 0 0 0 0 0 1 0 1 0 1 0 1 0 0 0 0 0 0 1]

    NTL::GF2XModulus modulus;
    NTL::build(modulus, poly);

    NTL::GF2X x(1, 1);
    NTL::PowerMod(poly, x, 2000, modulus);

    uint64_t p = 0;
    for (int i = 0; i < NTL::deg(poly); i++) {
        uint8_t coeff = NTL::conv<uint>(NTL::coeff(poly, i));
        p |= coeff << i;
    }
    // std::cout << std::hex << p << std::endl;
    // 733fa2
}

static uint64_t jump_2000(uint64_t n) {
    size_t i, b, j;
    uint64_t s = 0;
    for (b = 0; b < 24; b++) {
        if (0xF33FA2 & (1u << b))
            s ^= n;
        n = hash(n);
    }
    return s;
}

int main(int argc, char* argv[]) {
    std::ifstream file(argv[1]);

    std::string line;
    uint64_t sum = 0;
    while (std::getline(file, line)) {
        uint64_t n = std::stoull(line);
        sum += jump_2000(n);
    }
    std::cout << sum << std::endl;

    return 0;
}

-- CreateTable
CREATE TABLE `Pos` (
    `id` VARCHAR(191) NOT NULL,
    `namaPos` VARCHAR(191) NOT NULL,
    `kodePos` VARCHAR(191) NOT NULL,
    `lokasi` VARCHAR(191) NULL,

    UNIQUE INDEX `Pos_namaPos_key`(`namaPos`),
    UNIQUE INDEX `Pos_kodePos_key`(`kodePos`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Guest` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `alamat` VARCHAR(191) NOT NULL,
    `asalPerusahaan` VARCHAR(191) NOT NULL,
    `jabatan` VARCHAR(191) NOT NULL,
    `noTelp` VARCHAR(191) NOT NULL,
    `keperluan` TEXT NOT NULL,
    `tanggalBerkunjung` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `posId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'PETUGAS',
    `posId` VARCHAR(191) NULL,

    UNIQUE INDEX `Admin_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Alat` (
    `id` VARCHAR(191) NOT NULL,
    `namaAlat` VARCHAR(191) NOT NULL,
    `barcode` VARCHAR(191) NOT NULL,
    `kategori` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'TERSEDIA',
    `posId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Alat_barcode_key`(`barcode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Checklist` (
    `id` VARCHAR(191) NOT NULL,
    `alatId` VARCHAR(191) NOT NULL,
    `petugas` VARCHAR(191) NOT NULL,
    `waktuKeluar` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `waktuKembali` DATETIME(3) NULL,
    `kondisiKeluar` VARCHAR(191) NOT NULL DEFAULT 'BAIK',
    `kondisiBalik` VARCHAR(191) NULL,
    `keterangan` TEXT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'BELUM_KEMBALI',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Guest` ADD CONSTRAINT `Guest_posId_fkey` FOREIGN KEY (`posId`) REFERENCES `Pos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Admin` ADD CONSTRAINT `Admin_posId_fkey` FOREIGN KEY (`posId`) REFERENCES `Pos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Alat` ADD CONSTRAINT `Alat_posId_fkey` FOREIGN KEY (`posId`) REFERENCES `Pos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Checklist` ADD CONSTRAINT `Checklist_alatId_fkey` FOREIGN KEY (`alatId`) REFERENCES `Alat`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

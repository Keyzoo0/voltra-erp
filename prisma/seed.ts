import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clean existing data
  await prisma.productionLog.deleteMany()
  await prisma.statusLog.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.bomLine.deleteMany()
  await prisma.bom.deleteMany()
  await prisma.component.deleteMany()
  await prisma.supplier.deleteMany()
  await prisma.user.deleteMany()

  // Users
  const password = await bcrypt.hash('admin123', 12)
  const users = await Promise.all([
    prisma.user.create({
      data: { username: 'admin', password, name: 'Zainul Admin', role: 'admin' },
    }),
    prisma.user.create({
      data: { username: 'supervisor', password, name: 'Rina Supervisor', role: 'supervisor' },
    }),
    prisma.user.create({
      data: { username: 'operator', password, name: 'Budi Operator', role: 'operator' },
    }),
  ])
  console.log(`   ✓ ${users.length} users created`)

  // Suppliers
  const suppliers = await Promise.all([
    prisma.supplier.create({
      data: { name: 'PT Elektronik Maju', contact: '021-5550123', leadTime: 5, rating: 4.5 },
    }),
    prisma.supplier.create({
      data: { name: 'CV Komponen Jaya', contact: '031-4445678', leadTime: 7, rating: 4.0 },
    }),
    prisma.supplier.create({
      data: { name: 'Shenzhen Tech Co.', contact: '+86-755-88886666', leadTime: 14, rating: 3.5 },
    }),
  ])
  console.log(`   ✓ ${suppliers.length} suppliers created`)

  // Components (50 items)
  const componentData = [
    { partNumber: 'RES-0402-10K', description: 'Resistor 10KΩ 0402 1%', stockQty: 10000, minStock: 1000, location: 'A-01' },
    { partNumber: 'RES-0603-1K', description: 'Resistor 1KΩ 0603 5%', stockQty: 5000, minStock: 500, location: 'A-02' },
    { partNumber: 'CAP-0402-100N', description: 'Capacitor 100nF 0402 X7R', stockQty: 8000, minStock: 1000, location: 'B-01' },
    { partNumber: 'CAP-0603-10U', description: 'Capacitor 10µF 0603 X5R', stockQty: 3000, minStock: 500, location: 'B-02' },
    { partNumber: 'CAP-0805-100U', description: 'Capacitor 100µF 0805 Electrolytic', stockQty: 500, minStock: 100, location: 'B-03' },
    { partNumber: 'IND-0603-10UH', description: 'Inductor 10µH 0603', stockQty: 2000, minStock: 200, location: 'C-01' },
    { partNumber: 'DIO-SOD323-1N4148', description: 'Diode 1N4148 SOD-323', stockQty: 4000, minStock: 500, location: 'D-01' },
    { partNumber: 'DIO-SMA-SS34', description: 'Schottky Diode SS34 SMA', stockQty: 1500, minStock: 200, location: 'D-02' },
    { partNumber: 'TRANS-SOT23-BC847', description: 'NPN Transistor BC847 SOT-23', stockQty: 2500, minStock: 300, location: 'E-01' },
    { partNumber: 'LED-0603-RED', description: 'LED Red 0603', stockQty: 6000, minStock: 500, location: 'F-01' },
    { partNumber: 'LED-0603-GREEN', description: 'LED Green 0603', stockQty: 5000, minStock: 500, location: 'F-02' },
    { partNumber: 'IC-SOIC8-STM32', description: 'STM32F103C8T6 MCU SOIC-8', stockQty: 200, minStock: 50, location: 'G-01' },
    { partNumber: 'IC-SOIC8-MAX485', description: 'RS485 Transceiver MAX485 SOIC-8', stockQty: 500, minStock: 100, location: 'G-02' },
    { partNumber: 'IC-SOIC16-OPA2345', description: 'Op-Amp OPA2345 SOIC-16', stockQty: 300, minStock: 50, location: 'G-03' },
    { partNumber: 'IC-QFP32-STM32F4', description: 'STM32F407VGT6 MCU QFP-32', stockQty: 80, minStock: 20, location: 'G-04' },
    { partNumber: 'IC-SOT23-AMS1117', description: 'Voltage Regulator AMS1117-3.3 SOT-23', stockQty: 800, minStock: 100, location: 'G-05' },
    { partNumber: 'CONN-USB-MICRO', description: 'USB Micro B Connector', stockQty: 1000, minStock: 200, location: 'H-01' },
    { partNumber: 'CONN-HEADER-2X4', description: 'Pin Header 2x4 Male 2.54mm', stockQty: 2000, minStock: 300, location: 'H-02' },
    { partNumber: 'CONN-JST-XH-3', description: 'JST XH 3-Pin Connector', stockQty: 1500, minStock: 200, location: 'H-03' },
    { partNumber: 'CONN-TERMINAL-2', description: '2-Pin Screw Terminal', stockQty: 600, minStock: 100, location: 'H-04' },
    { partNumber: 'FUSE-1206-500MA', description: 'Fuse 500mA 1206', stockQty: 800, minStock: 100, location: 'I-01' },
    { partNumber: 'CRYSTAL-3225-8MHZ', description: 'Crystal 8MHz 3225', stockQty: 500, minStock: 100, location: 'J-01' },
    { partNumber: 'CRYSTAL-3225-32KHZ', description: 'Crystal 32.768kHz 3225', stockQty: 400, minStock: 100, location: 'J-02' },
    { partNumber: 'PCB-2LAYER-5X5', description: 'PCB 2 Layer 5x5cm FR4', stockQty: 50, minStock: 10, location: 'K-01' },
    { partNumber: 'PCB-4LAYER-10X10', description: 'PCB 4 Layer 10x10cm FR4', stockQty: 25, minStock: 5, location: 'K-02' },
    { partNumber: 'SOLDER-PASTE-SAC305', description: 'Solder Paste SAC305 100g', stockQty: 10, minStock: 3, location: 'L-01' },
    { partNumber: 'FLUX-PEN-10ML', description: 'Flux Pen 10ml', stockQty: 15, minStock: 5, location: 'L-02' },
    { partNumber: 'WIRE-AWG22-RED', description: 'Hook-up Wire AWG22 Red 10m', stockQty: 20, minStock: 5, location: 'M-01' },
    { partNumber: 'WIRE-AWG22-BLACK', description: 'Hook-up Wire AWG22 Black 10m', stockQty: 20, minStock: 5, location: 'M-02' },
    { partNumber: 'HEATSINK-TO220', description: 'Heatsink TO-220 Aluminum', stockQty: 100, minStock: 20, location: 'N-01' },
    { partNumber: 'SPACER-M3-10MM', description: 'PCB Spacer M3 10mm Nylon', stockQty: 500, minStock: 100, location: 'N-02' },
    { partNumber: 'SCREW-M3-6MM', description: 'Screw M3x6mm Stainless', stockQty: 1000, minStock: 200, location: 'N-03' },
    { partNumber: 'NUT-M3', description: 'Nut M3 Stainless', stockQty: 1000, minStock: 200, location: 'N-04' },
    { partNumber: 'WASHER-M3', description: 'Washer M3 Stainless', stockQty: 500, minStock: 100, location: 'N-05' },
    { partNumber: 'ENCLOSURE-ABS-120X80', description: 'ABS Enclosure 120x80x40mm', stockQty: 30, minStock: 10, location: 'O-01' },
    { partNumber: 'LABEL-50X25', description: 'Label Sticker 50x25mm', stockQty: 1000, minStock: 200, location: 'P-01' },
    { partNumber: 'BATTERY-CR2032', description: 'Battery CR2032 3V', stockQty: 200, minStock: 50, location: 'Q-01' },
    { partNumber: 'BATTERY-HOLDER-SMD', description: 'CR2032 Battery Holder SMD', stockQty: 300, minStock: 50, location: 'Q-02' },
    { partNumber: 'SWITCH-TACT-6MM', description: 'Tactile Switch 6x6mm', stockQty: 2000, minStock: 300, location: 'R-01' },
    { partNumber: 'SWITCH-SLIDE-SPDT', description: 'Slide Switch SPDT', stockQty: 400, minStock: 50, location: 'R-02' },
    { partNumber: 'POT-3296-10K', description: 'Trimpot 10KΩ 3296', stockQty: 300, minStock: 50, location: 'S-01' },
    { partNumber: 'FET-SOT23-IRLZ44N', description: 'N-Ch MOSFET IRLZ44N SOT-23', stockQty: 500, minStock: 100, location: 'E-02' },
    { partNumber: 'OPTO-SOIC4-PC817', description: 'Optocoupler PC817 SOIC-4', stockQty: 600, minStock: 100, location: 'D-03' },
    { partNumber: 'DIODE-ZENER-3V3-SOD123', description: 'Zener Diode 3.3V SOD-123', stockQty: 1000, minStock: 100, location: 'D-04' },
    { partNumber: 'IC-SOIC8-FT232RL', description: 'USB-UART FT232RL SOIC-8', stockQty: 150, minStock: 30, location: 'G-06' },
    { partNumber: 'IC-SOIC8-24LC256', description: 'EEPROM 24LC256 SOIC-8', stockQty: 200, minStock: 50, location: 'G-07' },
    { partNumber: 'CONN-RJ45', description: 'RJ45 Jack Connector', stockQty: 300, minStock: 50, location: 'H-05' },
    { partNumber: 'TRANS-SOT223-IRF520', description: 'MOSFET IRF520 SOT-223', stockQty: 200, minStock: 30, location: 'E-03' },
    { partNumber: 'CAP-POLAR-10UF', description: 'Polarized Cap 10µF 16V', stockQty: 2000, minStock: 300, location: 'B-04' },
    { partNumber: 'RES-ARRAY-4X10K', description: 'Resistor Array 4x10KΩ 0603', stockQty: 800, minStock: 100, location: 'A-03' },
  ]

  const components = await Promise.all(
    componentData.map((c, i) =>
      prisma.component.create({
        data: {
          ...c,
          supplierId: suppliers[i % suppliers.length].id,
        },
      })
    )
  )
  console.log(`   ✓ ${components.length} components created`)

  // BOMs (10 PCB designs)
  const bomData = [
    {
      pcbName: 'Power Supply Module v2',
      revision: '2.1',
      lines: [
        { componentIdx: 16, qty: 1, des: 'J1' }, // CONN-USB-MICRO
        { componentIdx: 48, qty: 2, des: 'C1,C2' }, // CAP-POLAR-10UF
        { componentIdx: 15, qty: 1, des: 'U1' }, // IC-SOT23-AMS1117
        { componentIdx: 2, qty: 2, des: 'C3,C4' }, // CAP-0402-100N
        { componentIdx: 0, qty: 1, des: 'R1' }, // RES-0402-10K
      ],
    },
    {
      pcbName: 'STM32 Controller Board',
      revision: '1.0',
      lines: [
        { componentIdx: 14, qty: 1, des: 'U1' }, // IC-QFP32-STM32F4
        { componentIdx: 2, qty: 5, des: 'C1-C5' }, // CAP-0402-100N
        { componentIdx: 3, qty: 2, des: 'C6,C7' }, // CAP-0603-10U
        { componentIdx: 0, qty: 4, des: 'R1-R4' }, // RES-0402-10K
        { componentIdx: 9, qty: 1, des: 'LED1' }, // LED-0603-RED
        { componentIdx: 10, qty: 1, des: 'LED2' }, // LED-0603-GREEN
        { componentIdx: 21, qty: 1, des: 'X1' }, // CRYSTAL-3225-8MHZ
        { componentIdx: 22, qty: 1, des: 'X2' }, // CRYSTAL-3225-32KHZ
        { componentIdx: 39, qty: 2, des: 'SW1,SW2' }, // SWITCH-TACT-6MM
        { componentIdx: 17, qty: 1, des: 'J1' }, // CONN-HEADER-2X4
      ],
    },
    {
      pcbName: 'RS485 Communication Module',
      revision: '2.0',
      lines: [
        { componentIdx: 12, qty: 1, des: 'U1' }, // IC-SOIC8-MAX485
        { componentIdx: 0, qty: 2, des: 'R1,R2' }, // RES-0402-10K
        { componentIdx: 2, qty: 2, des: 'C1,C2' }, // CAP-0402-100N
        { componentIdx: 42, qty: 1, des: 'U2' }, // OPTO-SOIC4-PC817
        { componentIdx: 17, qty: 1, des: 'J1' }, // CONN-HEADER-2X4
        { componentIdx: 19, qty: 1, des: 'J2' }, // CONN-TERMINAL-2
      ],
    },
    {
      pcbName: 'Sensor Interface Board',
      revision: '1.2',
      lines: [
        { componentIdx: 13, qty: 2, des: 'U1,U2' }, // IC-SOIC16-OPA2345
        { componentIdx: 0, qty: 6, des: 'R1-R6' }, // RES-0402-10K
        { componentIdx: 1, qty: 2, des: 'R7,R8' }, // RES-0603-1K
        { componentIdx: 2, qty: 4, des: 'C1-C4' }, // CAP-0402-100N
        { componentIdx: 17, qty: 2, des: 'J1,J2' }, // CONN-HEADER-2X4
        { componentIdx: 19, qty: 1, des: 'J3' }, // CONN-TERMINAL-2
      ],
    },
    {
      pcbName: 'USB-UART Programmer',
      revision: '1.0',
      lines: [
        { componentIdx: 44, qty: 1, des: 'U1' }, // IC-SOIC8-FT232RL
        { componentIdx: 16, qty: 1, des: 'J1' }, // CONN-USB-MICRO
        { componentIdx: 2, qty: 3, des: 'C1-C3' }, // CAP-0402-100N
        { componentIdx: 0, qty: 2, des: 'R1,R2' }, // RES-0402-10K
        { componentIdx: 9, qty: 1, des: 'LED1' }, // LED-0603-RED
        { componentIdx: 10, qty: 1, des: 'LED2' }, // LED-0603-GREEN
        { componentIdx: 17, qty: 1, des: 'J2' }, // CONN-HEADER-2X4
      ],
    },
    {
      pcbName: 'Motor Driver Board',
      revision: '1.1',
      lines: [
        { componentIdx: 41, qty: 2, des: 'Q1,Q2' }, // FET-SOT23-IRLZ44N
        { componentIdx: 7, qty: 2, des: 'D1,D2' }, // DIO-SMA-SS34
        { componentIdx: 0, qty: 4, des: 'R1-R4' }, // RES-0402-10K
        { componentIdx: 2, qty: 2, des: 'C1,C2' }, // CAP-0402-100N
        { componentIdx: 19, qty: 2, des: 'J1,J2' }, // CONN-TERMINAL-2
        { componentIdx: 17, qty: 1, des: 'J3' }, // CONN-HEADER-2X4
      ],
    },
    {
      pcbName: 'Battery Management Module',
      revision: '1.0',
      lines: [
        { componentIdx: 37, qty: 1, des: 'BT1' }, // BATTERY-CR2032
        { componentIdx: 38, qty: 1, des: 'H1' }, // BATTERY-HOLDER-SMD
        { componentIdx: 15, qty: 1, des: 'U1' }, // IC-SOT23-AMS1117
        { componentIdx: 3, qty: 2, des: 'C1,C2' }, // CAP-0603-10U
        { componentIdx: 2, qty: 2, des: 'C3,C4' }, // CAP-0402-100N
        { componentIdx: 0, qty: 2, des: 'R1,R2' }, // RES-0402-10K
        { componentIdx: 9, qty: 1, des: 'LED1' }, // LED-0603-RED
        { componentIdx: 43, qty: 1, des: 'D1' }, // DIODE-ZENER-3V3-SOD123
      ],
    },
    {
      pcbName: 'Ethernet Gateway',
      revision: '1.0',
      lines: [
        { componentIdx: 14, qty: 1, des: 'U1' }, // IC-QFP32-STM32F4
        { componentIdx: 46, qty: 1, des: 'J1' }, // CONN-RJ45
        { componentIdx: 2, qty: 6, des: 'C1-C6' }, // CAP-0402-100N
        { componentIdx: 3, qty: 2, des: 'C7,C8' }, // CAP-0603-10U
        { componentIdx: 0, qty: 4, des: 'R1-R4' }, // RES-0402-10K
        { componentIdx: 21, qty: 1, des: 'X1' }, // CRYSTAL-3225-8MHZ
        { componentIdx: 9, qty: 2, des: 'LED1,LED2' }, // LED-0603-RED
        { componentIdx: 17, qty: 1, des: 'J2' }, // CONN-HEADER-2X4
      ],
    },
    {
      pcbName: 'EEPROM Storage Module',
      revision: '1.0',
      lines: [
        { componentIdx: 45, qty: 1, des: 'U1' }, // IC-SOIC8-24LC256
        { componentIdx: 0, qty: 2, des: 'R1,R2' }, // RES-0402-10K
        { componentIdx: 2, qty: 2, des: 'C1,C2' }, // CAP-0402-100N
        { componentIdx: 17, qty: 1, des: 'J1' }, // CONN-HEADER-2X4
      ],
    },
    {
      pcbName: 'Display Adapter Board',
      revision: '2.1',
      lines: [
        { componentIdx: 17, qty: 2, des: 'J1,J2' }, // CONN-HEADER-2X4
        { componentIdx: 2, qty: 2, des: 'C1,C2' }, // CAP-0402-100N
        { componentIdx: 0, qty: 4, des: 'R1-R4' }, // RES-0402-10K
        { componentIdx: 39, qty: 1, des: 'SW1' }, // SWITCH-TACT-6MM
        { componentIdx: 9, qty: 1, des: 'LED1' }, // LED-0603-RED
        { componentIdx: 40, qty: 1, des: 'SW2' }, // SWITCH-SLIDE-SPDT
        { componentIdx: 18, qty: 1, des: 'J3' }, // CONN-JST-XH-3
      ],
    },
  ]

  const boms = await Promise.all(
    bomData.map((bom) =>
      prisma.bom.create({
        data: {
          pcbName: bom.pcbName,
          revision: bom.revision,
          bomLines: {
            create: bom.lines.map((line) => ({
              componentId: components[line.componentIdx].id,
              qtyPerUnit: line.qty,
              designator: line.des,
            })),
          },
        },
      })
    )
  )
  console.log(`   ✓ ${boms.length} BOMs created`)

  // Orders (20 sample orders)
  const statuses = ['DRAFT', 'CONFIRMED', 'IN_PROD', 'QC', 'PACKING', 'SHIPPED', 'COMPLETED']
  const clients = ['PT ABC Elektronik', 'CV Maju Jaya', 'PT Teknologi Mandiri', 'UD Sinar Abadi', 'CV Karya Elektrik']
  const priorities = ['low', 'normal', 'high', 'urgent']

  for (let i = 0; i < 20; i++) {
    const status = statuses[i % statuses.length]
    const daysAgo = Math.floor(Math.random() * 60)
    const dueDays = Math.floor(Math.random() * 30) + 7
    const createdAt = new Date()
    createdAt.setDate(createdAt.getDate() - daysAgo)
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + dueDays)

    const bom = boms[i % boms.length]
    const qty = Math.floor(Math.random() * 100) + 10
    const unitCost = Math.floor(Math.random() * 50000) + 5000

    const order = await prisma.order.create({
      data: {
        client: clients[i % clients.length],
        status,
        priority: priorities[i % priorities.length],
        dueDate,
        notes: idx2notes(i),
        createdBy: users[i % users.length].id,
        createdAt,
        orderItems: {
          create: {
            bomId: bom.id,
            quantity: qty,
            unitCost,
          },
        },
        statusLogs: {
          create: {
            fromStatus: null,
            toStatus: 'DRAFT',
            userId: users[0].id,
            notes: 'Order created via seed',
            createdAt: new Date(createdAt.getTime() + 1000),
          },
        },
      },
    })

    // Add confirm log
    if (['CONFIRMED', 'IN_PROD', 'QC', 'PACKING', 'SHIPPED', 'COMPLETED'].includes(status)) {
      await prisma.statusLog.create({
        data: {
          orderId: order.id,
          fromStatus: 'DRAFT',
          toStatus: 'CONFIRMED',
          userId: users[1].id,
          notes: 'Stock confirmed',
          createdAt: new Date(createdAt.getTime() + 2000),
        },
      })
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'CONFIRMED', updatedAt: new Date(createdAt.getTime() + 2000) },
      })
    }

    // Add production logs for active orders
    if (['IN_PROD', 'QC', 'PACKING', 'SHIPPED'].includes(status)) {
      const orderItem = await prisma.orderItem.findFirst({ where: { orderId: order.id } })
      if (orderItem) {
        await prisma.productionLog.create({
          data: {
            orderItemId: orderItem.id,
            station: 'solder',
            operatorId: users[2].id,
            startedAt: new Date(createdAt.getTime() + 3000),
            status: 'in_progress',
          },
        })
      }
    }

    // Add completion logs
    if (['COMPLETED'].includes(status)) {
      await prisma.statusLog.create({
        data: {
          orderId: order.id,
          fromStatus: 'CONFIRMED',
          toStatus: 'IN_PROD',
          userId: users[2].id,
          notes: 'Production started',
          createdAt: new Date(createdAt.getTime() + 3000),
        },
      })
      await prisma.statusLog.create({
        data: {
          orderId: order.id,
          fromStatus: 'IN_PROD',
          toStatus: 'QC',
          userId: users[2].id,
          notes: 'QC check',
          createdAt: new Date(createdAt.getTime() + 4000),
        },
      })
      await prisma.statusLog.create({
        data: {
          orderId: order.id,
          fromStatus: 'QC',
          toStatus: 'PACKING',
          userId: users[1].id,
          notes: 'QC passed',
          createdAt: new Date(createdAt.getTime() + 5000),
        },
      })
      await prisma.statusLog.create({
        data: {
          orderId: order.id,
          fromStatus: 'PACKING',
          toStatus: 'SHIPPED',
          userId: users[1].id,
          notes: 'Shipped',
          createdAt: new Date(createdAt.getTime() + 6000),
        },
      })
      await prisma.statusLog.create({
        data: {
          orderId: order.id,
          fromStatus: 'SHIPPED',
          toStatus: 'COMPLETED',
          userId: users[0].id,
          notes: 'Order completed',
          createdAt: new Date(createdAt.getTime() + 7000),
        },
      })

      // Update order status and add production logs
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'COMPLETED',
          updatedAt: new Date(createdAt.getTime() + 7000),
        },
      })

      const orderItem = await prisma.orderItem.findFirst({ where: { orderId: order.id } })
      if (orderItem) {
        await prisma.productionLog.create({
          data: {
            orderItemId: orderItem.id,
            station: 'reflow',
            operatorId: users[2].id,
            startedAt: new Date(createdAt.getTime() + 3000),
            completedAt: new Date(createdAt.getTime() + 10000),
            status: 'pass',
          },
        })
      }
    }
  }
  console.log(`   ✓ 20 sample orders created`)
  console.log('\n✅ Seed complete!')
  console.log('   Login credentials:')
  console.log('   admin    / admin123')
  console.log('   supervisor / admin123')
  console.log('   operator / admin123')
}

function idx2notes(i: number): string | null {
  const notes = [
    null,
    'Rush order, mohon diprioritaskan',
    'Customer request sampling 5 unit dulu',
    null,
    'Pakai komponen alternatif jika stok habis',
    'QC ketat, customer minta sertifikat',
    null,
    'Order ulang dari bulan lalu',
    null,
    'Komponen sudah ready semua',
    'Tunggu konfirmasi BOM dari customer',
    null,
    'Partial delivery ok',
    'Harap pakai packaging anti-static',
    null,
    'QC video diperlukan untuk approval',
    null,
    'Pakai PCB versi terbaru rev 2.1',
    'Shipping ke cabang Surabaya',
    null,
  ]
  return notes[i % notes.length]
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { verifyUserToken } from '@/lib/auth';

function parseWeightInKg(quantityKey: string): number {
  const match = quantityKey.match(/(\d+(?:\.\d+)?)\s*(kg|l|g|ml)?/i);
  if (!match) return 0;
  const val = parseFloat(match[1]);
  const unit = match[2] ? match[2].toLowerCase() : 'kg';
  if (unit === 'g' || unit === 'ml') {
    return val / 1000;
  }
  return val; // Assume kg/l is 1:1 for weight purposes
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    
    // Check if the request is associated with an active authenticated user
    const decoded = await verifyUserToken();
    const isDistributor = decoded?.role === 'distributor';

    const body = await request.json();
    const { name, phone, address, quantity, paymentMethod, orderType, gstNumber, companyName, items } = body;

    // Validate base customer info
    if (!name || !phone || !address || !quantity || !paymentMethod) {
      return NextResponse.json(
        { error: 'All fields (name, phone, address, quantity, paymentMethod) are required' },
        { status: 400 }
      );
    }

    if (paymentMethod !== 'COD' && paymentMethod !== 'WHATSAPP') {
      return NextResponse.json(
        { error: 'Invalid payment method. Allowed values are: COD, WHATSAPP' },
        { status: 400 }
      );
    }

    let calculatedPrice = 0;
    const finalItems = [];

    // If structured items are provided (cart checkout or B2B)
    if (items && Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        const { productId, quantityKey, quantity: itemQty } = item;
        
        if (!productId) {
          return NextResponse.json({ error: 'Product ID is required for items' }, { status: 400 });
        }

        const product = await Product.findById(productId);
        if (!product || !product.isActive) {
          return NextResponse.json({ error: `Product not found or inactive: ${productId}` }, { status: 400 });
        }

        const variant = product.variants.find((v) => v.size === quantityKey);
        if (!variant) {
          return NextResponse.json(
            { error: `Variant size ${quantityKey} not found for product ${product.name}` },
            { status: 400 }
          );
        }

        const qtyNum = Number(itemQty);
        if (isNaN(qtyNum) || qtyNum <= 0) {
          return NextResponse.json(
            { error: `Invalid quantity for variant ${quantityKey}` },
            { status: 400 }
          );
        }

        const pricePerUnit = isDistributor ? variant.wholesalePrice : variant.price;
        calculatedPrice += pricePerUnit * qtyNum;
        
        finalItems.push({
          productId: product._id,
          quantityKey,
          quantity: qtyNum,
          priceAtPurchase: pricePerUnit,
        });
      }
    } else {
      // Fallback for single item purchases (backward compatibility - assuming Bagdi Atta)
      const defaultProduct = await Product.findOne({ slug: 'bagdi-atta' });
      if (!defaultProduct) {
        return NextResponse.json({ error: 'Default product not configured in database' }, { status: 500 });
      }

      const variant = defaultProduct.variants.find((v) => v.size === quantity);
      if (!variant) {
        return NextResponse.json(
          { error: `Invalid quantity variant: ${quantity}` },
          { status: 400 }
        );
      }

      const pricePerUnit = isDistributor ? variant.wholesalePrice : variant.price;
      calculatedPrice = pricePerUnit;
      
      finalItems.push({
        productId: defaultProduct._id,
        quantityKey: quantity,
        quantity: 1,
        priceAtPurchase: pricePerUnit,
      });
    }

    // B2B MOQ Check
    if (orderType === 'DISTRIBUTOR') {
      const totalWeight = finalItems.reduce((sum, item) => {
        const wt = parseWeightInKg(item.quantityKey);
        return sum + wt * item.quantity;
      }, 0);
      
      if (totalWeight < 100) {
        return NextResponse.json(
          { error: 'Wholesale B2B orders must meet the Minimum Order Quantity of 100 kg total weight.' },
          { status: 400 }
        );
      }
    }

    // Generate unique order ID in format BAGRIXXXXX
    let orderId = '';
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      orderId = `BAGRI${randomNum}`;
      const existing = await Order.findOne({ orderId });
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      const { v4: uuidv4 } = require('uuid');
      orderId = `BAGRI${uuidv4().substring(0, 5).toUpperCase()}`;
    }

    // Deduce product summary string for backwards compatibility
    let productSummary = '';
    if (finalItems.length === 1) {
      const prod = await Product.findById(finalItems[0].productId);
      productSummary = prod ? prod.name : 'Unknown Product';
    } else {
      productSummary = `Multi-item Order (${finalItems.length} products)`;
    }

    const order = await Order.create({
      orderId,
      name,
      phone,
      address,
      product: productSummary,
      quantity, // summary string
      price: calculatedPrice,
      paymentMethod,
      status: 'pending',
      orderType: orderType || 'D2C',
      userId: decoded?.userId || undefined,
      gstNumber: orderType === 'DISTRIBUTOR' ? gstNumber : undefined,
      companyName: orderType === 'DISTRIBUTOR' ? companyName : undefined,
      items: finalItems,
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating order:', error);
    let errorMessage = 'Internal Server Error';
    if (error.name === 'MongooseServerSelectionError' || error.message.includes('ServerSelection')) {
      errorMessage = 'Database connection failed. Please ensure your IP address (223.184.238.27) is whitelisted in MongoDB Atlas Network Access.';
    }
    return NextResponse.json({ error: errorMessage, details: error.message }, { status: 500 });
  }
}


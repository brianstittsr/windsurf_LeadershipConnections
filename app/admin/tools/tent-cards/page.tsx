'use client';

import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { FaIdCard, FaDownload, FaArrowLeft, FaEye, FaPlus, FaTrash, FaGripVertical } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

interface TentCard {
  id: string;
  title: string;
  lineItems: string[];
}

// Avery 5302 Template Specifications
// Small Tent Cards - 2" x 3-1/2" - 4 per sheet - Print to Edge
const AVERY_5302 = {
  pageWidth: 215.9, // 8.5" in mm
  pageHeight: 279.4, // 11" in mm
  cardWidth: 88.9, // 3-1/2" in mm
  cardHeight: 50.8, // 2" in mm (this is the folded height, full card is 4" = 101.6mm)
  fullCardHeight: 101.6, // 4" in mm (unfolded)
  marginTop: 12.7, // Approximate top margin
  marginLeft: 19.05, // Approximate left margin
  columns: 2,
  rows: 2,
  horizontalGap: 0, // Print to edge
  verticalGap: 12.7, // Gap between cards
};

export default function TentCardCreator() {
  const [cards, setCards] = useState<TentCard[]>([
    { id: 'card-1', title: '', lineItems: [''] }
  ]);
  const [generating, setGenerating] = useState(false);
  const [logoBase64, setLogoBase64] = useState<string | null>(null);

  // Load logo
  useEffect(() => {
    loadLogo();
  }, []);

  const loadLogo = async () => {
    try {
      const response = await fetch('/images/logo/LeadershipConnectionsLogo.png');
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoBase64(reader.result as string);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Error loading logo:', error);
    }
  };

  const addCard = () => {
    setCards([
      ...cards,
      { id: `card-${Date.now()}`, title: '', lineItems: [''] }
    ]);
  };

  const removeCard = (cardId: string) => {
    if (cards.length > 1) {
      setCards(cards.filter(c => c.id !== cardId));
    }
  };

  const updateCardTitle = (cardId: string, title: string) => {
    setCards(cards.map(c => 
      c.id === cardId ? { ...c, title } : c
    ));
  };

  const addLineItem = (cardId: string) => {
    setCards(cards.map(c => 
      c.id === cardId ? { ...c, lineItems: [...c.lineItems, ''] } : c
    ));
  };

  const updateLineItem = (cardId: string, index: number, value: string) => {
    setCards(cards.map(c => 
      c.id === cardId 
        ? { ...c, lineItems: c.lineItems.map((item, i) => i === index ? value : item) }
        : c
    ));
  };

  const removeLineItem = (cardId: string, index: number) => {
    setCards(cards.map(c => 
      c.id === cardId && c.lineItems.length > 1
        ? { ...c, lineItems: c.lineItems.filter((_, i) => i !== index) }
        : c
    ));
  };

  const duplicateCard = (card: TentCard) => {
    const newCard: TentCard = {
      id: `card-${Date.now()}`,
      title: card.title,
      lineItems: [...card.lineItems]
    };
    setCards([...cards, newCard]);
  };

  const getValidCards = () => {
    return cards.filter(c => c.title.trim() || c.lineItems.some(item => item.trim()));
  };

  const generatePDF = async () => {
    const validCards = getValidCards();
    if (validCards.length === 0) {
      alert('Please add at least one card with a title or line items.');
      return;
    }

    setGenerating(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'letter'
      });

      const cardsPerPage = AVERY_5302.columns * AVERY_5302.rows;
      let cardIndex = 0;

      for (let i = 0; i < validCards.length; i++) {
        // Add new page if needed
        if (cardIndex > 0 && cardIndex % cardsPerPage === 0) {
          doc.addPage();
        }

        const pageIndex = cardIndex % cardsPerPage;
        const col = pageIndex % AVERY_5302.columns;
        const row = Math.floor(pageIndex / AVERY_5302.columns);

        const x = AVERY_5302.marginLeft + col * (AVERY_5302.cardWidth + AVERY_5302.horizontalGap);
        const y = AVERY_5302.marginTop + row * (AVERY_5302.fullCardHeight + AVERY_5302.verticalGap);

        drawTentCard(doc, validCards[i], x, y);
        cardIndex++;
      }

      // Save the PDF
      const filename = `tent_cards_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const drawTentCard = (doc: jsPDF, card: TentCard, x: number, y: number) => {
    const { cardWidth, fullCardHeight } = AVERY_5302;
    const halfHeight = fullCardHeight / 2;
    const centerX = x + cardWidth / 2;
    const padding = 5;

    // Draw card outline (light, for cutting guide)
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.2);
    doc.rect(x, y, cardWidth, fullCardHeight);

    // Draw fold line (dashed)
    doc.setDrawColor(200, 200, 200);
    doc.setLineDashPattern([2, 2], 0);
    doc.line(x, y + halfHeight, x + cardWidth, y + halfHeight);
    doc.setLineDashPattern([], 0);

    // ===== TOP HALF (back when folded) =====
    drawCardContent(doc, card, x, y, cardWidth, halfHeight, centerX, padding, false);

    // ===== BOTTOM HALF (front when folded - upside down) =====
    drawCardContent(doc, card, x, y + halfHeight, cardWidth, halfHeight, centerX, padding, true);
  };

  const drawCardContent = (
    doc: jsPDF, 
    card: TentCard, 
    x: number, 
    y: number, 
    width: number, 
    height: number, 
    centerX: number, 
    padding: number,
    upsideDown: boolean
  ) => {
    // Logo dimensions (reduced by 80% - now 20% of original size)
    const logoWidth = 8;
    const logoHeight = 5.6;
    
    const validItems = card.lineItems.filter(item => item.trim());
    
    // Calculate total content height first for centering
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    const titleLines = card.title ? doc.splitTextToSize(card.title, width - padding * 2) : [];
    
    let totalHeight = logoHeight + 2; // logo + gap after logo
    if (titleLines.length > 0) {
      totalHeight += titleLines.length * 4.5;
    }
    if (validItems.length > 0) {
      totalHeight += 3 + (validItems.length * 3.5); // gap + items
    }
    
    // Calculate vertical center of this half
    const halfCenterY = y + height / 2;
    
    // Starting position for content (top of content block, centered in half)
    const startY = halfCenterY - totalHeight / 2;
    
    if (upsideDown) {
      // For upside down: we need to draw everything rotated 180 degrees
      // The "top" of the upside-down content should be near the fold line (bottom of this section)
      // So we mirror the positions
      
      let contentY = startY;
      
      // Logo (at visual top when flipped = near bottom of this section in PDF coordinates)
      // For 180-degree rotation, we position from where the bottom of the logo should be
      const logoY = y + height - (contentY - y) - logoHeight;
      if (logoBase64) {
        doc.addImage(
          logoBase64, 
          'PNG', 
          centerX - logoWidth / 2, 
          logoY, 
          logoWidth, 
          logoHeight
        );
      }
      contentY += logoHeight + 2;
      
      // Title (upside down)
      if (card.title) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(30, 41, 59);
        // Mirror Y position within this half
        const titleY = y + height - (contentY - y) + 1;
        doc.text(titleLines, centerX, titleY, { align: 'center', angle: 180 });
        contentY += titleLines.length * 4.5;
      }
      
      // Line items (upside down)
      if (validItems.length > 0) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(60, 60, 60);
        contentY += 3;
        
        validItems.forEach((item) => {
          const itemText = `• ${item}`;
          // Mirror Y position within this half
          const itemY = y + height - (contentY - y);
          doc.text(itemText, centerX, itemY, { align: 'center', angle: 180 });
          contentY += 3.5;
        });
      }
    } else {
      // Normal orientation
      let contentY = startY;
      
      // Logo at top
      if (logoBase64) {
        doc.addImage(
          logoBase64, 
          'PNG', 
          centerX - logoWidth / 2, 
          contentY, 
          logoWidth, 
          logoHeight
        );
      }
      contentY += logoHeight + 2;
      
      // Title
      if (card.title) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(30, 41, 59);
        doc.text(titleLines, centerX, contentY + 3, { align: 'center' });
        contentY += titleLines.length * 4.5;
      }
      
      // Line items
      if (validItems.length > 0) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(60, 60, 60);
        contentY += 3;
        
        validItems.forEach((item) => {
          const itemText = `• ${item}`;
          doc.text(itemText, centerX, contentY, { align: 'center' });
          contentY += 3.5;
        });
      }
    }
  };

  const validCards = getValidCards();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/tools"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <FaArrowLeft className="mr-2" />
          Back to Tools
        </Link>
        <div className="flex items-center gap-3">
          <FaIdCard className="text-3xl text-orange-500" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Small Tent Card Creator</h1>
            <p className="text-gray-600">Create tent cards using Avery 5302 template (4 per sheet)</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="space-y-4">
          {/* Cards List */}
          {cards.map((card, cardIndex) => (
            <div key={card.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Card {cardIndex + 1}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => duplicateCard(card)}
                    className="text-sm text-primary hover:text-primary/80 px-2 py-1"
                    title="Duplicate card"
                  >
                    Duplicate
                  </button>
                  {cards.length > 1 && (
                    <button
                      onClick={() => removeCard(card.id)}
                      className="text-sm text-red-500 hover:text-red-700 px-2 py-1"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => updateCardTitle(card.id, e.target.value)}
                    placeholder="e.g., Registration, Check-In, Information"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-primary focus:border-primary"
                    maxLength={50}
                  />
                </div>

                {/* Line Items */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Line Items
                    </label>
                    <button
                      onClick={() => addLineItem(card.id)}
                      className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                    >
                      <FaPlus className="text-xs" />
                      Add Item
                    </button>
                  </div>
                  <div className="space-y-2">
                    {card.lineItems.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex gap-2 items-center">
                        <span className="text-gray-400 text-sm w-4">{itemIndex + 1}.</span>
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updateLineItem(card.id, itemIndex, e.target.value)}
                          placeholder={`Line item ${itemIndex + 1}`}
                          className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-900"
                          maxLength={60}
                        />
                        {card.lineItems.length > 1 && (
                          <button
                            onClick={() => removeLineItem(card.id, itemIndex)}
                            className="text-red-400 hover:text-red-600 p-1"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add Card Button */}
          <button
            onClick={addCard}
            className="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 text-gray-500 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
          >
            <FaPlus />
            Add Another Card
          </button>

          {/* Generate Button */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <button
              onClick={generatePDF}
              disabled={validCards.length === 0 || generating}
              className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <FaDownload />
              {generating ? 'Generating PDF...' : `Generate ${validCards.length} Card${validCards.length !== 1 ? 's' : ''}`}
            </button>

            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Template Info:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Avery 5302 Small Tent Cards</li>
                <li>• 2" × 3-1/2" (folded size)</li>
                <li>• 4 cards per sheet (2 columns × 2 rows)</li>
                <li>• Letter size (8.5" × 11")</li>
                <li>• Print to edge</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
          <div className="flex items-center gap-2 mb-4">
            <FaEye className="text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
          </div>
          
          {/* Single Card Preview */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 mb-4">
            <p className="text-xs text-gray-500 mb-2 text-center">Card Preview (one side shown)</p>
            <div 
              className="mx-auto bg-white border border-gray-200 rounded shadow-sm flex flex-col items-center p-2"
              style={{ width: '180px', height: '110px' }}
            >
              {/* Logo (small - 20% of original) */}
              <div className="mb-0.5">
                <Image
                  src="/images/logo/LeadershipConnectionsLogo.png"
                  alt="Logo"
                  width={20}
                  height={14}
                  className="object-contain"
                />
              </div>
              
              {/* Title */}
              <p className="text-sm font-bold text-gray-900 text-center leading-tight">
                {cards[0]?.title || 'Card Title'}
              </p>
              
              {/* Line Items */}
              <div className="text-xs text-gray-600 text-center mt-0.5 leading-tight overflow-hidden">
                {cards[0]?.lineItems.filter(i => i.trim()).slice(0, 4).map((item, i) => (
                  <p key={i} className="truncate">• {item}</p>
                ))}
                {cards[0]?.lineItems.filter(i => i.trim()).length === 0 && (
                  <>
                    <p>• Line item 1</p>
                    <p>• Line item 2</p>
                  </>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Fold along center line to create tent
            </p>
          </div>

          {/* Cards Summary */}
          <div className="border border-gray-200 rounded-lg">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">
                Cards to Print ({validCards.length})
              </span>
            </div>
            <div className="max-h-64 overflow-y-auto p-2">
              {validCards.length === 0 ? (
                <p className="text-center text-gray-500 py-4 text-sm">
                  No valid cards. Add a title or line items to create cards.
                </p>
              ) : (
                <div className="space-y-2">
                  {validCards.map((card, index) => (
                    <div key={card.id} className="text-sm p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">{index + 1}.</span>
                        <span className="font-medium text-gray-900">
                          {card.title || '(No title)'}
                        </span>
                      </div>
                      {card.lineItems.filter(i => i.trim()).length > 0 && (
                        <div className="ml-6 text-xs text-gray-500 mt-1">
                          {card.lineItems.filter(i => i.trim()).length} line item(s)
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-3 text-center">
            {validCards.length > 0 && (
              <>Will generate {Math.ceil(validCards.length / 4)} page{Math.ceil(validCards.length / 4) !== 1 ? 's' : ''}</>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

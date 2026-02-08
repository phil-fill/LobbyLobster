from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session
from io import BytesIO
from datetime import datetime

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_RIGHT, TA_CENTER

from database import get_db
from models import Reservation

router = APIRouter()


def generate_invoice_pdf(reservation: Reservation) -> bytes:
    """Generate PDF invoice for a reservation"""
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=20*mm, leftMargin=20*mm,
                           topMargin=20*mm, bottomMargin=20*mm)
    
    # Container for elements
    elements = []
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#E63946'),
        spaceAfter=30,
        alignment=TA_CENTER
    )
    
    header_style = ParagraphStyle(
        'CustomHeader',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=colors.HexColor('#1D3557'),
        spaceAfter=12,
    )
    
    # Hotel header
    elements.append(Paragraph("🦞 LobbyLobster Hotel", title_style))
    elements.append(Spacer(1, 12))
    
    # Invoice title
    elements.append(Paragraph("INVOICE", header_style))
    elements.append(Spacer(1, 6))
    
    # Invoice info table
    invoice_data = [
        ['Invoice Date:', datetime.now().strftime('%B %d, %Y')],
        ['Reservation ID:', reservation.id[:8]],
        ['Status:', reservation.status],
    ]
    
    invoice_table = Table(invoice_data, colWidths=[50*mm, 80*mm])
    invoice_table.setStyle(TableStyle([
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#666666')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
    ]))
    elements.append(invoice_table)
    elements.append(Spacer(1, 20))
    
    # Guest information
    elements.append(Paragraph("Guest Information", header_style))
    guest_info = [
        ['Name:', reservation.guest_name],
    ]
    if reservation.guest_company:
        guest_info.append(['Company:', reservation.guest_company])
    if reservation.guest_email:
        guest_info.append(['Email:', reservation.guest_email])
    if reservation.guest_phone:
        guest_info.append(['Phone:', reservation.guest_phone])
    
    # Guest address
    address_parts = []
    if reservation.guest_address:
        address_parts.append(reservation.guest_address)
    if reservation.guest_city or reservation.guest_postal_code:
        city_postal = ', '.join(filter(None, [reservation.guest_postal_code, reservation.guest_city]))
        if city_postal:
            address_parts.append(city_postal)
    if reservation.guest_country:
        address_parts.append(reservation.guest_country)
    
    if address_parts:
        guest_info.append(['Address:', '<br/>'.join(address_parts)])
    
    guest_table = Table(guest_info, colWidths=[50*mm, 120*mm])
    guest_table.setStyle(TableStyle([
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#666666')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    elements.append(guest_table)
    elements.append(Spacer(1, 20))
    
    # Company address (if provided)
    if reservation.guest_company and (reservation.company_address or reservation.company_city):
        elements.append(Paragraph("Company Address", header_style))
        company_address_parts = []
        if reservation.company_address:
            company_address_parts.append(reservation.company_address)
        if reservation.company_city or reservation.company_postal_code:
            city_postal = ', '.join(filter(None, [reservation.company_postal_code, reservation.company_city]))
            if city_postal:
                company_address_parts.append(city_postal)
        if reservation.company_country:
            company_address_parts.append(reservation.company_country)
        
        company_table = Table([['', '<br/>'.join(company_address_parts)]], colWidths=[50*mm, 120*mm])
        company_table.setStyle(TableStyle([
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ]))
        elements.append(company_table)
        elements.append(Spacer(1, 20))
    
    # Stay details
    elements.append(Paragraph("Stay Details", header_style))
    stay_data = [
        ['Room:', f"{reservation.room.number} - {reservation.room.name}"],
        ['Check-in:', reservation.check_in.strftime('%B %d, %Y')],
        ['Check-out:', reservation.check_out.strftime('%B %d, %Y')],
        ['Nights:', str((reservation.check_out - reservation.check_in).days)],
    ]
    
    stay_table = Table(stay_data, colWidths=[50*mm, 80*mm])
    stay_table.setStyle(TableStyle([
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#666666')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
    ]))
    elements.append(stay_table)
    elements.append(Spacer(1, 20))
    
    # Pricing breakdown
    elements.append(Paragraph("Charges", header_style))
    
    nights = (reservation.check_out - reservation.check_in).days
    price_per_night = reservation.price_per_night or 0
    
    charges_data = [
        ['Description', 'Quantity', 'Unit Price', 'Amount'],
    ]
    
    # Room charge
    room_total = price_per_night * nights
    charges_data.append([
        f'Room {reservation.room.number}',
        f'{nights} nights',
        f'€{price_per_night:.2f}',
        f'€{room_total:.2f}'
    ])
    
    # Breakfast
    if reservation.breakfast_included:
        charges_data.append([
            'Breakfast (included)',
            '',
            '',
            'Included'
        ])
    
    charges_table = Table(charges_data, colWidths=[60*mm, 30*mm, 30*mm, 30*mm])
    charges_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1D3557')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('ALIGN', (1, 0), (-1, -1), 'RIGHT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 11),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('TOPPADDING', (0, 1), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ]))
    elements.append(charges_table)
    elements.append(Spacer(1, 12))
    
    # Total
    total_price = reservation.total_price or room_total
    total_data = [
        ['', '', 'TOTAL:', f'€{total_price:.2f}']
    ]
    
    total_table = Table(total_data, colWidths=[60*mm, 30*mm, 30*mm, 30*mm])
    total_table.setStyle(TableStyle([
        ('ALIGN', (2, 0), (-1, 0), 'RIGHT'),
        ('FONTNAME', (2, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (2, 0), (-1, 0), 12),
        ('TEXTCOLOR', (2, 0), (-1, 0), colors.HexColor('#E63946')),
        ('LINEABOVE', (2, 0), (-1, 0), 2, colors.HexColor('#1D3557')),
        ('TOPPADDING', (2, 0), (-1, 0), 12),
    ]))
    elements.append(total_table)
    elements.append(Spacer(1, 20))
    
    # Payment method
    if reservation.payment_method:
        elements.append(Paragraph("Payment Method", header_style))
        payment_labels = {
            'CASH': 'Cash',
            'DEBIT_CARD': 'Debit Card',
            'CREDIT_CARD': 'Credit Card',
            'INVOICE': 'Invoice (will be sent by post)'
        }
        payment_text = payment_labels.get(reservation.payment_method, reservation.payment_method)
        
        payment_table = Table([[payment_text]], colWidths=[170*mm])
        payment_table.setStyle(TableStyle([
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F1FAEE')),
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#1D3557')),
            ('TOPPADDING', (0, 0), (-1, -1), 12),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ]))
        elements.append(payment_table)
        elements.append(Spacer(1, 20))
    
    # Notes
    if reservation.notes:
        elements.append(Paragraph("Notes", header_style))
        elements.append(Paragraph(reservation.notes, styles['Normal']))
        elements.append(Spacer(1, 20))
    
    # Footer
    elements.append(Spacer(1, 30))
    footer_style = ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=8,
        textColor=colors.grey,
        alignment=TA_CENTER
    )
    elements.append(Paragraph("Thank you for staying at LobbyLobster Hotel!", footer_style))
    elements.append(Paragraph("Generated on " + datetime.now().strftime('%Y-%m-%d %H:%M'), footer_style))
    
    # Build PDF
    doc.build(elements)
    
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes


@router.get("/{reservation_id}/invoice")
async def get_invoice_pdf(
    reservation_id: str,
    db: Session = Depends(get_db)
):
    """Generate and download invoice PDF for a reservation"""
    reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    
    pdf_bytes = generate_invoice_pdf(reservation)
    
    filename = f"invoice_{reservation.guest_name.replace(' ', '_')}_{reservation.check_in}.pdf"
    
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        }
    )

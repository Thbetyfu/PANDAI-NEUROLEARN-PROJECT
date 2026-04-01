import os
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image as RLImage

class ReportGenerator:
    """Modul untuk menghasilkan Laporan Sesi Belajar Kognitif (PDF)."""
    
    def __init__(self, output_dir="reports"):
        self.output_dir = output_dir
        os.makedirs(self.output_dir, exist_ok=True)
        self.styles = getSampleStyleSheet()
        
    def generate_session_report(self, student_name, data):
        """
        Menghasilkan PDF laporan berdasarkan data sesi.
        data = {
            "duration": "00:45:00",
            "avg_focus": 85,
            "max_load": 70,
            "dominant_emotion": "HAPPY",
            "security_status": "VERIFIED",
            "ai_insight": "Sangat bagus! Pertahankan fokus Anda."
        }
        """
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"Report_{student_name}_{timestamp}.pdf"
        filepath = os.path.join(self.output_dir, filename)
        
        doc = SimpleDocTemplate(filepath, pagesize=A4)
        elements = []
        
        # 1. Header
        title_style = ParagraphStyle(
            'TitleStyle', parent=self.styles['Heading1'],
            fontSize=24, textColor=colors.HexColor("#001D5A"), spaceAfter=20
        )
        elements.append(Paragraph("Laporan Sesi Belajar PANDAI", title_style))
        elements.append(Paragraph(f"Subjek: {student_name} | Tanggal: {datetime.now().strftime('%d %B %Y')}", self.styles['Normal']))
        elements.append(Spacer(1, 20))
        
        # 2. Key Metrics Table
        table_data = [
            ["Metrik Kognitif", "Nilai"],
            ["Durasi Belajar", data.get("duration", "0s")],
            ["Rata-rata Fokus", f"{data.get('avg_focus', 0)}%"],
            ["Beban Kognitif Maksimun", f"{data.get('max_load', 0)}%"],
            ["Dominan Emosi", data.get("dominant_emotion", "N/A")],
            ["Status Identitas (Anti-Cheat)", data.get("security_status", "SAFE")]
        ]
        
        t = Table(table_data, colWidths=[200, 200])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#4F46E5")),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor("#F1F5F9")),
            ('GRID', (0, 0), (-1, -1), 1, colors.white)
        ]))
        elements.append(t)
        elements.append(Spacer(1, 30))
        
        # 3. AI Insights Section
        elements.append(Paragraph("Analisis PANDAI AI (Neuro-Architect):", self.styles['Heading2']))
        ai_style = ParagraphStyle(
            'AIStyle', parent=self.styles['Normal'],
            fontSize=11, fontName="Helvetica-Oblique", leftIndent=20, rightIndent=20,
            leading=16, spaceBefore=10, textColor=colors.darkblue
        )
        elements.append(Paragraph(data.get("ai_insight", "Data tidak mencukupi untuk analisis mandalam."), ai_style))
        
        # 4. Footer
        elements.append(Spacer(1, 50))
        elements.append(Paragraph("--- Dokumen ini dihasilkan secara otomatis oleh PANDAI Neuro-Client 2.0 ---", self.styles['Small']))
        
        doc.build(elements)
        print(f"[Report] ✅ PDF Berhasil dibuat: {filepath}")
        return filepath

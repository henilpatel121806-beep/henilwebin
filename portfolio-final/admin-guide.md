# Admin Guide — Henil Patel Portfolio
## Edit portfolio.json only. No HTML, CSS, or JS changes needed.

---

## 1. Update CGPA
```json
"dashboard": {
  "btechCGPA": "7.33",   ← change this
  "diplomaCGPA": "8.99"
}
```
Also update inside `education[]` → `"cgpa"` field.

---

## 2. Add a New Project
Add to `projects[]` array:
```json
{
  "id": "uart-controller",
  "title": "UART Controller",
  "subtitle": "Verilog HDL · Serial Communication · RTL",
  "category": "RTL Design",
  "tags": ["Verilog", "UART", "RTL", "FPGA"],
  "filters": ["RTL", "FPGA"],
  "featured": true,
  "status": {
    "simulated": true,
    "hardwareTested": false,
    "documentationAvailable": false
  },
  "metrics": { "operations": "115200", "flags": "Baud", "board": "DE2", "linesOfCode": "~150", "modules": "2", "tools": "Quartus" },
  "date": "2026",
  "institution": "Institute of Technology, Nirma University",
  "collaborator": null,
  "supervisor": null,
  "summary": "Your description here.",
  "highlights": ["Point 1", "Point 2"],
  "operations": null,
  "flags": null,
  "methodology": "How you designed it.",
  "outcome": "What it proves.",
  "github": "https://github.com/henilpatel121806-beep",
  "report": "assets/reports/uart-report.pdf",
  "thumbnail": null,
  "demoVideo": null
}
```
Then upload report PDF to `assets/reports/`.

---

## 3. Add a Certificate
Add to `certifications[]`:
```json
{
  "id": "nptel-sta",
  "title": "Static Timing Analysis",
  "organization": "NPTEL – IIT",
  "platform": "SWAYAM",
  "date": "2027",
  "duration": "8-week course",
  "score": null,
  "credits": 4,
  "highlight": "STA methodology — PrimeTime",
  "description": "Course description.",
  "image": "assets/certificates/nptel-sta.png",
  "pdf": "assets/certificates/nptel-sta.pdf",
  "featured": true,
  "pills": ["4 Credits", "NPTEL"]
}
```
Upload image to `assets/certificates/` and PDF too.

---

## 4. Add an Internship
Add to `experience[]`:
```json
{
  "role": "FPGA Design Intern",
  "company": "NVIDIA / AMD / Intel",
  "location": "Bangalore, India",
  "period": "May 2027 – Jul 2027",
  "duration": "2 months",
  "type": "technical",
  "description": "What you did.",
  "skills": ["Verilog", "FPGA", "RTL"],
  "certificate": "assets/certificates/company-cert.png",
  "projects": ["Project 1", "Project 2"]
}
```

---

## 5. Add a Skill
Add to the correct array inside `skills{}`:
```json
"hardware": [..., "SystemVerilog"],
"eda":      [..., "Vivado"]
```
Dashboard skill count updates automatically.

---

## 6. Add Coursework
Add to `coursework[]`:
```json
"coursework": [..., "VLSI Design"]
```

---

## 7. Add an Achievement
Add to `achievements[]`:
```json
{
  "icon": "🏆",
  "title": "Achievement Title",
  "description": "What you achieved.",
  "year": "2027"
}
```

---

## 8. Update Contact Info
Edit `meta{}`:
```json
"email":    "newemail@gmail.com",
"phone":    "+91 XXXXXXXXXX",
"linkedin": "https://linkedin.com/in/your-new-url",
"github":   "https://github.com/your-new-handle"
```

---

## 9. Replace Resume
1. Name your new PDF: `henil-patel-resume.pdf`
2. Upload to `assets/resume/`
3. Update version in JSON:
```json
"resumeVersion": "v3.0-Jan2027"
```

---

## 10. Replace Profile Photo
1. Name your new photo: `henil-patel.jpg`
2. Upload to `assets/images/`
3. No JSON change needed (path is already set).

---

## 11. Update Education (Expected Graduation)
```json
"expectedGraduation": "May 2028"
```
⚠️ Graduation year is **2028** everywhere. Do not change to 2029.

---

## 12. Add Upcoming Project
Add to `upcomingProjects[]`:
```json
{
  "icon": "🔌",
  "title": "Your Project Name",
  "tags": ["Verilog", "RTL"],
  "eta": "2027",
  "category": "RTL"
}
```

---

## 13. Update Formspree (Contact Form)
1. Go to https://formspree.io → create free account
2. Create a form → copy the endpoint URL
3. Update in JSON:
```json
"contact": {
  "formspreeEndpoint": "https://formspree.io/f/YOUR_ID"
}
```

---

## 14. Update lastUpdated
```json
"lastUpdated": "2027-01-15"
```

---

## 15. Deploy Changes
- GitHub Pages: just push your changes → site updates in ~1 minute
- Vercel: push to GitHub → auto-deploys instantly
- See `deployment-guide.md` for full steps

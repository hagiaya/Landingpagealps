import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const { name, service_type, project_description, features, budget } = body;
    
    // Format budget for display
    const formatBudget = (budgetKey: string): string => {
      switch (budgetKey) {
        case 'less-than-5jt': return '< Rp 5.000.000';
        case '5jt-10jt': return 'Rp 5.000.000 - Rp 10.000.000';
        case '10jt-25jt': return 'Rp 10.000.000 - Rp 25.000.000';
        case '25jt-50jt': return 'Rp 25.000.000 - Rp 50.000.000';
        case 'more-than-50jt': return '> Rp 50.000.000';
        case 'not-sure': return 'Belum pasti';
        default: return budgetKey;
      }
    };

    // Analyze project complexity based on features
    let complexity = 'rendah';
    let estimatedCost = 'Rp 5.000.000 - Rp 10.000.000';
    
    // Count keywords that suggest higher complexity
    const highComplexityKeywords = [
      'login', 'register', 'authenticat', 'payment', 'payment gateway', 
      'real-time', 'database', 'admin panel', 'dashboard', 'api', 
      'integrat', 'ecommerce', 'chat', 'notification', 'push', 
      'cloud', 'machine learning', 'ai', 'ml', 'data analysis', 
      'report', 'analytics', 'multi user', 'role', 'permission',
      'payment integration', 'login system', 'user management'
    ];
    
    const mediumComplexityKeywords = [
      'form', 'database', 'multi', 'responsive', 'mobile',
      'web app', 'application', 'search', 'filter', 'sort'
    ];
    
    let complexityScore = 0;
    highComplexityKeywords.forEach(keyword => {
      if (features.toLowerCase().includes(keyword) || project_description.toLowerCase().includes(keyword)) {
        complexityScore += 2;
      }
    });
    
    mediumComplexityKeywords.forEach(keyword => {
      if (features.toLowerCase().includes(keyword) || project_description.toLowerCase().includes(keyword)) {
        complexityScore += 1;
      }
    });
    
    if (complexityScore >= 6) {
      complexity = 'tinggi';
      estimatedCost = complexityScore >= 10 ? '> Rp 50.000.000' : 'Rp 25.000.000 - Rp 50.000.000';
    } else if (complexityScore >= 3) {
      complexity = 'sedang';
      estimatedCost = 'Rp 10.000.000 - Rp 25.000.000';
    } else {
      complexity = 'rendah';
      estimatedCost = '< Rp 10.000.000';
    }
    
    // Adjust cost based on selected budget
    let finalEstimation = estimatedCost;
    if (budget === 'less-than-5jt' && complexity !== 'rendah') {
      finalEstimation = 'Kami menyarankan anggaran yang lebih tinggi untuk proyek dengan kompleksitas ' + complexity + '.';
    } else if (budget === 'not-sure') {
      finalEstimation = 'Berdasarkan fitur yang Anda inginkan, perkiraan biaya yang sesuai adalah ' + estimatedCost;
    } else {
      // If budget is selected and matches complexity, keep the estimation as is
      // If budget is too low for complexity, suggest higher budget
      if (complexity === 'tinggi' && (budget === 'less-than-5jt' || budget === '5jt-10jt')) {
        finalEstimation = 'Proyek dengan kompleksitas tinggi biasanya membutuhkan anggaran di atas Rp 25.000.000. Kami menyarankan untuk menyesuaikan anggaran Anda.';
      } else if (complexity === 'sedang' && budget === 'less-than-5jt') {
        finalEstimation = 'Proyek dengan kompleksitas sedang biasanya membutuhkan anggaran minimal Rp 10.000.000. Kami menyarankan untuk menyesuaikan anggaran Anda.';
      }
    }
    
    // Generate more dynamic and personalized analysis
    const projectTypeDesc = service_type === 'website' ? 'website' : 
                           service_type === 'aplikasi' ? 'aplikasi mobile/web' : 'desain UI/UX';
    
    const projectSpecifics = [];
    if (features.toLowerCase().includes('login') || features.toLowerCase().includes('register')) {
      projectSpecifics.push('otentikasi pengguna');
    }
    if (features.toLowerCase().includes('payment') || features.toLowerCase().includes('pembayaran')) {
      projectSpecifics.push('sistem pembayaran');
    }
    if (features.toLowerCase().includes('admin') || features.toLowerCase().includes('dashboard')) {
      projectSpecifics.push('panel admin/dashboard');
    }
    if (features.toLowerCase().includes('notifikasi') || features.toLowerCase().includes('notification')) {
      projectSpecifics.push('sistem notifikasi');
    }
    
    const specificsText = projectSpecifics.length > 0 ? 
      `Fitur spesifik yang akan dibangun: ${projectSpecifics.join(', ')}.` : 
      'Berdasarkan deskripsi Anda, proyek ini akan mencakup pengembangan standar sesuai kebutuhan.';
    
    const recommendations = [];
    if (complexity === 'rendah') {
      recommendations.push('Proyek ini ideal untuk dimulai dengan cepat. Kami bisa mengembangkan MVP (Minimum Viable Product) dalam waktu singkat.');
    } else if (complexity === 'sedang') {
      recommendations.push('Proyek ini membutuhkan perencanaan dan pengembangan bertahap. Kami menyarankan pendekatan agile untuk memastikan kualitas dan fleksibilitas.');
    } else {
      recommendations.push('Proyek ini kompleks dan akan membutuhkan tim pengembang yang berpengalaman. Kami merekomendasikan pendekatan modular untuk manajemen yang lebih baik.');
    }
    
    if (budget === 'less-than-5jt' && complexity !== 'rendah') {
      recommendations.push('Anggaran Anda mungkin terbatas untuk kompleksitas proyek ini. Kami bisa membantu menyusun fitur prioritas (MVP) untuk tetap berada di anggaran.');
    } else if (budget !== 'not-sure' && complexity === 'tinggi' && budget !== 'more-than-50jt') {
      recommendations.push('Dengan kompleksitas tinggi, anggaran yang lebih besar akan memungkinkan implementasi yang lebih lengkap dan kualitas yang lebih baik.');
    }
    
    const timelineEstimate = complexity === 'rendah' ? '2-4 minggu' : 
                            complexity === 'sedang' ? '1-3 bulan' : '3-6 bulan';
    
    // Create more dynamic greeting based on time of day
    const currentHour = new Date().getHours();
    let greeting = "Selamat pagi";
    if (currentHour >= 12 && currentHour < 15) {
      greeting = "Selamat siang";
    } else if (currentHour >= 15 && currentHour < 18) {
      greeting = "Selamat sore";
    } else if (currentHour >= 18) {
      greeting = "Selamat malam";
    }
    
    // Add emotional tone to the response
    const emotionalTone = complexity === 'rendah' ? 'menyenangkan' : 
                         complexity === 'sedang' ? 'menantang, tapi layak' : 
                         'besar dan menarik';
    
    // Generate dynamic project description
    const projectInsights = [
      `Proyek ${projectTypeDesc} dengan fokus pada ${features.split(',').slice(0, 2).join(' dan ') || 'kebutuhan spesifik Anda'}`,
      `Solusi digital ${service_type === 'website' ? 'berbasis web' : service_type === 'aplikasi' ? 'mobile atau web' : 'dengan fokus desain'} yang dirancang untuk mencapai tujuan bisnis Anda`,
      `Implementasi teknologi modern untuk ${service_type === 'aplikasi' ? 'aplikasi mobile' : service_type === 'website' ? 'website responsif' : 'antarmuka pengguna'} yang efektif`
    ];
    
    const randomInsight = projectInsights[Math.floor(Math.random() * projectInsights.length)];
    
    const analysis = `${greeting} ${name}! 🎯 Terima kasih telah mempercayakan rencana proyek Anda kepada kami. Saya telah menganalisis detail yang Anda berikan dan berikut temuan menariknya:

**Jenis Proyek Anda:** ${service_type === 'website' ? 'Pembuatan Website' : service_type === 'aplikasi' ? 'Pengembangan Aplikasi' : 'Desain UI/UX'}

**Gambaran Proyek:** 
${randomInsight}

**Deskripsi Lengkap:** 
${project_description}

**Fitur-fitur yang Anda Inginkan:** 
${features}

**Wawasan Mendalam:**
${specificsText}

Kategori kompleksitas: ${complexity} - Artinya ini adalah proyek yang ${emotionalTone} untuk dikembangkan, dengan tingkat teknis ${complexity === 'rendah' ? 'dasar' : complexity === 'sedang' ? 'menengah' : 'tinggi'}, sangat tergantung pada fitur-fitur spesifik yang Anda minta.

**Perkiraan Waktu Pengerjaan:** ${timelineEstimate}

**Rincian Investasi:**
Berdasarkan kompleksitas dan anggaran yang Anda nyatakan (${formatBudget(budget)}), saya merekomendasikan investasi sekitar ${finalEstimation}. Ini mencakup:
- Perencanaan strategis dan desain awal
- Pengembangan dan integrasi fitur
- Quality assurance dan pengujian
- Deployment serta dokumentasi awal

**Saran Khusus untuk Kesuksesan Proyek:**
${recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

${complexity !== 'rendah' ? 'Proyek dengan kompleksitas ini akan sangat diuntungkan dengan diskusi awal untuk menyusun roadmap pengembangan yang efisien dan fokus pada fitur-fitur prioritas.' : 'Ini adalah proyek yang bisa segera diwujudkan setelah sedikit penyesuaian spesifikasi sesuai kebutuhan Anda yang spesifik.'}

${Math.random() > 0.5 ? 'Kami antusias untuk membantu mewujudkan ide Anda menjadi kenyataan! 😊' : 'Tim kami siap membantu Anda dalam setiap langkah pengembangan proyek ini.'}

Silakan hubungi kami kapan pun jika ingin membahas lebih lanjut atau menyesuaikan rencana proyek Anda.`;

    console.log('AI analysis completed for:', { name, service_type, budget, complexity });
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in AI analysis:', error);
    const fallbackAnalysis = `Halo! Terima kasih telah mengirimkan formulir permintaan Anda.

Saat ini sistem analisis kami sedang dalam perawatan. Tim kami akan segera menghubungi Anda untuk membantu dengan permintaan proyek Anda.

Silakan hubungi kami langsung jika Anda memiliki pertanyaan lebih lanjut.`;

    return new Response(
      JSON.stringify({ 
        success: false, 
        analysis: fallbackAnalysis,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } } // Still return 200 but with success: false
    );
  }
}
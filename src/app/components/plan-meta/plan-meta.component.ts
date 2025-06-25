import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Costs, Plan, Points } from '../../model/Plan';
import { faCarSide, faEuroSign, faFileImage, faShareNodes, faTemperatureHalf, faThermometer } from '@fortawesome/free-solid-svg-icons';
import { faCalendar, faFileCode } from '@fortawesome/free-regular-svg-icons';
import html2canvas from 'html2canvas';


@Component({
  selector: 'plan-meta',
  imports: [CommonModule, FontAwesomeModule, HttpClientModule],
  templateUrl: './plan-meta.component.html',
  styleUrl: './plan-meta.component.sass'
})
export class PlanMetaComponent implements OnInit {

  @Input() onlyCard: boolean = false;
  @Input() planKey: string;

  faTemperatureHalf = faTemperatureHalf
  faCalendar = faCalendar
  faCarSide = faCarSide
  faEuroSign = faEuroSign
  faFileImage = faFileImage
  faFileCode = faFileCode
  faShareNodes = faShareNodes

  plan: Plan;

  @ViewChild('planImage') planPanel: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadImageLink') downloadImageLink: ElementRef;

  constructor(private route: ActivatedRoute, private httpClient: HttpClient) { }

  ngOnInit(): void {
    if (!this.planKey)
      this.route.params.subscribe(params => {
        this.planKey = params['planKey'];
        this.loadPlan();
      });
    else
      this.loadPlan();
  }

  loadPlan() {
    this.httpClient.get<Plan>("data/" + this.planKey + "/" + this.planKey + ".json?t=" + (new Date().getTime())).subscribe(data => {
      console.log(data);
      this.plan = data;
      this.plan.totalDuration = this.calcDaysDiff(new Date(data.outboundTravel.landing.time), new Date(data.returnTravel.takeoff.time));
      let extrasCost = -1;
      if (data.extras) {
        extrasCost = 0;
        data.extras.forEach(e => {
          extrasCost += e.price;
        });
      }
      let internalTravelCost = -1;
      if (data.program) {
        internalTravelCost = 0;
        data.program.forEach(d => {
          if (d.internalTravel)
            internalTravelCost += d.internalTravel.price;
        });
      }
      let carCost = -1
      if (data.averagePrices.car && data.averagePrices.car > 0)
        carCost = Math.round(data.averagePrices.car * this.plan.totalDuration / this.plan.persons);
      this.plan.costs = new Costs((data.outboundTravel.price + data.returnTravel.price),
        this.plan.totalDuration * data.averagePrices.food,
        Math.round(this.plan.totalDuration * data.averagePrices.sleep / this.plan.persons), carCost, extrasCost, internalTravelCost);
      if (this.plan.program) {
        this.plan.program.forEach((day, dIndex) => {
          day.date = new Date(new Date(this.plan.start).getTime() + (1000 * 60 * 60 * 24) * dIndex);
        });
      }

      if (this.plan.points) {
        this.plan.points = new Points(data.points.culture.value, data.points.wheater.value, data.points.nature.value, data.points.price.value)
      }
    });
  }

  calcDaysDiff(first: Date, second: Date) {
    return Math.round((second.getTime() - first.getTime()) / (1000 * 60 * 60 * 24)) + 1
  }



  downloadImage(format: string) {
    console.log(this.plan.meta.image);
    html2canvas(this.planPanel.nativeElement, { proxy: this.plan.meta.image, scale: 1, useCORS: true }).then(canvas => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      if (format == 'jpg') {
        this.downloadImageLink.nativeElement.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
        this.downloadImageLink.nativeElement.download = this.plan.key + '.jpg';
      }
      else {
        this.downloadImageLink.nativeElement.href = canvas.toDataURL('image/png');
        this.downloadImageLink.nativeElement.download = this.plan.key + '.png';
      }
      this.downloadImageLink.nativeElement.click();
      this.canvas.nativeElement.src = "";
    });
  }

  downloadHtml() {

    const html = '<!DOCTYPE html>\r\n' +
      '<html lang="en">\r\n' +
      '<head>\r\n' +
      '    <meta charset="UTF-8">\r\n' +
      '    <meta name="viewport" content="width=device-width, initial-scale=1.0">\r\n' +
      '    <meta property="og:image" content="https://journey-plans.web.app/meta/' + this.plan.key + '.jpg" key="image" />\r\n' +
      '    <meta property="og:url" content="https://journey-plans.web.app/meta/' + this.plan.key + '.html" key="url" />\r\n' +
      '    <meta property="og:title" content="' + this.plan.title + '" key="title"/>\r\n' +
      '    <meta property="og:type" content="website" key="type" />\r\n' +
      '    <meta property="og:image:width" content="1200" />\r\n' +
      '    <meta property="og:image:height" content="630" />\r\n' +
      '    <meta property="og:image:alt" content="' + this.plan.title + '" />\r\n' +
      '    <meta property="og:description" content="Oggi andiamo in viaggio in... ' + this.plan.title + '" />\r\n' +
      '    <meta property="og:updated_time" content="' + new Date().getTime() + '" />\r\n' +
      '    <meta http-equiv="refresh" content="0; url=https://journey-plans.web.app/plans/' + this.plan.key + '/">\r\n' +
      '    <title>' + this.plan.title + '</title>\r\n' +
      '</head>\r\n' +
      '<body>\r\n' +
      '</body>\r\n' +
      '</html>';

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,\r\n' + encodeURIComponent(html));
    element.setAttribute('download', this.plan.key + ".html");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  shareLink() {
    navigator.clipboard.writeText("https://journey-plans.web.app/meta/" + this.plan.key + ".html");
  }
}

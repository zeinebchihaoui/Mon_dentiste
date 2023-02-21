import { Component, ViewChild, OnInit } from '@angular/core';
import { IonSlides, Platform, AlertController, ToastController, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SearchComponent } from '../shared/search/search.component';
import { UserService } from 'src/app/core/services/user.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { SignaturePad } from 'angular2-signaturepad';
import { IonLoaderService } from '../core/services/ion-loader.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DocumentService } from '../core/services/document.service';
import { PatientService } from '../core/services/patient.service';
import { AuthService } from '../core/services/auth.service';
import { environment } from 'src/environments/environment';
import * as sha1 from 'sha1';
import { File } from '@ionic-native/File/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
const { clinic } = environment;

pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-q1cs',
  templateUrl: './q1cs.page.html',
  styleUrls: ['./q1cs.page.scss'],
})
export class Q1csPage implements OnInit {

  @ViewChild('slides') public slides: IonSlides;

  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  signaturePadOptions: Object = {
    minWidth: 2,
    canvasWidth: 300,
    canvasHeight: 200,
    backgroundColor: '#fff'
  };
  q1csFilled: any;
  patient: any;
  folder = '';

  sliderOptions: object;
  alias = 'Le patient :';
  pronoun = 'Il';
  responseNotFilled = 'n’a pas fourni de réponse.';
  pathImageSignature = '';
  pdfObj = null;
  blob: Blob;

  propertiesToSend = {
    youwant: null,
    youFind: null,
    youFindFace: null,
    gum: null,
    gumSmile: null,
    prepareRehabilitation: null,
    temporoJoint: null,
    frontTeeth: null,
    allTeeth: null,
    fullTreatment: null,
    surgery: null,
    attendingDentistName: null,
    praticienName: null,
    orlDoctorName: null,
    osteopathName: null,
    attendingDoctorName: null,
    patientRecommendingName: null,
  };


  questions = [
    {
      title: 'Pourquoi remplir ce questionnaire?',
      id: 1
    },
    {
      title: 'Avez-vous peur du dentiste ou de l’Orthodontiste?',
      id: 2
    },
  ];

  checkFieldsSlide4 = [
    {
      label: 'Occlusion',
      value: 'Occlusion ',
      checked: false,
    },
    {
      label: 'Esthétique',
      value: 'Esthétique ',
      checked: false,
    },
    {
      label: 'Améliorer votre sourire gingivale',
      value: 'améliorer son sourire gingivale',
      id: 'gumSmile',
      formControl: 'gumSmile',
      checked: false
    },
    {
      label: 'Préparation orthodontique à une réhabilitation prothétique(préparer vos dents à une restauration globale par votre dentiste)',
      value: 'Préparer ses dents à une restauration globale par son dentiste ',
      id: 'prepareRehabilitation',
      formControl: 'prepareRehabilitation',
      checked: false
    },
    {
      label: 'Articulation Temporo-Mandibulaire',
      value: 'Articulatier temporo-Mandibulaires ',
      id: 'articulation',
      formControl: 'temporoJoint',
      checked: false
    },
  ];

  wishes = [
    {
      label: 'Aligner rapidement les 6 dents de devant',
      value: 'Aligner rapidement les 6 dents de devant ',
      id: 'dentAvant',
      formControl: 'frontTeeth',
      checked: false
    },
    {
      label: 'Aligner toutes les dents',
      value: 'Aligner toutes les dents  ',
      id: 'dentAlign',
      formControl: 'allTeeth',
      checked: false
    },
    {
      label: 'Vous voulez un traitement complet d\'orthodontie',
      value: 'Avoir un traitement complet d\'orthodentie ',
      id: 'traitmComplet',
      formControl: 'fullTreatment',
      checked: false
    },
    {
      label: 'Êtes vous prêt à avoir une chirurgie ? si elle a nécessaire.',
      value: 'faire une chirurgie si elle est nécessaire ',
      id: 'chrirgieNec',
      formControl: 'surgery',
      checked: false
    },
  ];

  medicalSelect = [
    {
      label: 'Dentiste Traitant',
      filtredItem: [],
      items: [],
      formControl: 'attendingDentist',
      id: 'attendingDentist',
      cssClass: 'attendingDentist ionic-selectable-custom',
      titleTemplate: 'Sélectionner le dentiste traitant',
      searchFailText: 'Aucun dentiste trouvé',
      index: 0
    },
    {
      label: 'Praticien',
      filtredItem: [],
      items: [],
      formControl: 'praticien',
      id: 'praticien',
      cssClass: 'praticien ionic-selectable-custom',
      titleTemplate: 'Sélectionner le nom du praticien',
      searchFailText: 'Aucun praticien trouvé',
      index: 1
    },
    {
      label: 'ORL',
      filtredItem: [],
      items: [],
      formControl: 'orlDoctor',
      id: 'orl',
      cssClass: 'orl ionic-selectable-custom',
      titleTemplate: 'Sélectionner le médecin ORL',
      searchFailText: 'Aucun medecin trouvé',
      index: 2
    },
    {
      label: 'Ostépathe',
      filtredItem: [],
      items: [],
      formControl: 'osteopath',
      id: 'ostepathMedecin',
      cssClass: 'ostepathMedecin ionic-selectable-custom',
      titleTemplate: 'Sélectionner l\'ostéphate',
      searchFailText: 'Aucun medecin trouvé',
      index: 3
    },
    {
      label: 'Médecin Traitant',
      filtredItem: [],
      items: [],
      formControl: 'attendingDoctor',
      id: 'medecinTraitH',
      cssClass: 'medecinTraitH ionic-selectable-custom',
      titleTemplate: 'Sélectionner le médecin traitant',
      searchFailText: 'Aucun medecin trouvé',
      index: 4
    },
  ];

  patientSelect = [
    {
      label: 'Nom du patient',
      filtredItem: [],
      items: [],
      formControl: 'patientRecommending',
      id: 'patientRecommending',
      cssClass: 'patientRecommending ionic-selectable-custom',
      titleTemplate: 'Sélectionner le nom du patient',
      searchFailText: 'Aucun patient trouvé',
      index: 0
    }
  ];

  listknowClinic = [
    {
      label: 'Un Docteur',
      value: 'La réputation d\'un docteur',
      id: 1
    },
    {
      label: 'Internet',
      value: 'internet',
      id: 2
    },
    {
      label: 'Réputation DR. Patrice Bergeyron',
      value: 'La réputation du Dr Patrice Bergeyron',
      id: 3
    },
    {
      label: 'Un Ami(e)',
      value: 'par un Ami(e)',
      id: 4
    },
    {
      label: 'Un Patient du cabinet',
      value: 'par un patient du cabinet',
      id: 5
    },
  ];

  meansOfInternet = [
    {
      label: 'Site Cabinet',
      value: 'un site Cabinet'
    },
    {
      label: 'Site Scientifique',
      value: 'un site Scientifique'
    }
  ];





  yesNoDentalQuestions = [
    {
      label: 'Est-ce que tous vos soins de caries sont terminés?',
      formControl: 'cariesCompleted',
      agreeShown: 'Oui, les soins de caries sont terminés.',
      disagreeShown: 'Non, les soins de caries ne sont pas terminés.',
      agree: 'tous les doins de cures sont terminées',
      sameSlide: true
    },
    {
      label: 'Avez-vous des sensibilités dentaires?',
      formControl: 'dentalSensitivities',
      agreeShown: ' a des sensibilités dentaires',
      disagreeShown: ' n\'a pas de sensibilités dentaires.',
      agree: 'a des sensibilités dentaires',
      sameSlide: true
    },
    {
      label: 'Avez-vous des douleurs dentaires ?',
      formControl: 'dentalPains',
      agreeShown: ' a des douleurs dentaires',
      disagreeShown: ' n\'a pas de douleurs dentaires.',
      agree: 'a des douleurs dentaires',
      sameSlide: true
    },
    {
      label: 'Grincez-vous des dents la nuit ?',
      formControl: 'GrindsTeeth',
      agreeShown: ' grince les dents la nuit ',
      disagreeShown: ' ne se grince pas les dents la nuit. ',
      agree: 'Grince les dents la nuit',
      sameSlide: false
    },
    {
      label: 'Vos gencives saignent-elles lors du brossage ?',
      formControl: 'gumsOnBrushing',
      agreeShown: 'Saignement des gencives lors du brossage  ',
      disagreeShown: 'Absence de saignement des gencives lors du brossage. ',
      agree: 'ses gencives saignent lors du brossage',
      sameSlide: false
    },
    {
      label: 'Avez-vous déjà bénéficié d’un traitement orthodontique ?',
      formControl: 'orthodonticTreatment',
      agreeShown: ' a déjà bénéficié d’un traitement orthodontique',
      disagreeShown: ' n’a jamais bénéficié d’un traitement orthodontique',
      agree: 'a déja beneficié d\'un traitement Orthodontique',
      sameSlide: false
    },
  ];

  yesNoGeneralMedicalQuestions = [
    {
      label: 'Respirez-vous par la bouche, par exemple en dormant ?',
      formControl: 'BreatheByMouth',
      agreeShown: ' respire par la bouche en dormant.',
      disagreeShown: ' ne respire pas par la bouche en dormant.',
      agree: 'Respire par la bouche',
      sameSlide: true
    },
    {
      label: 'Présentez-vous une affection ORL reconnue ?',
      formControl: 'affectionOrl',
      agreeShown: ' présente une affection ORL reconnue',
      disagreeShown: ' ne présente pas une affection ORL',
      agree: 'affection ORL reconnue',
      sameSlide: true
    },
    {
      label: 'Souffrez-vous de craquements ou de douleurs articulaires au niveau des mâchoires ?',
      formControl: 'jawPain',
      agreeShown: 'Dysfonction ou troubles de l’articulation temporo-mandibulaire.',
      disagreeShown: 'Absence de douleurs au niveau des mâchoires',
      agree: 'craquement ou de douleurs articulaire au niveau des machoire',
      sameSlide: true
    },
    {
      label: 'Êtes-vous sujet à des réactions allergiques (Rhume des foins,Urticaire,Latex,Alliages...)?',
      formControl: 'allergy',
      agreeShown: ' souffre d’allergie',
      disagreeShown: ' n\'est pas sujet à des réactions allergiques.',
      agree: 'a des réactions allergiques',
      sameSlide: true
    },
    {
      label: 'Problèmes sanguins ( hémophilie, sang clair, anémie..) ?',
      formControl: 'BloodProblems',
      agreeShown: ' souffre de problèmes sanguins',
      disagreeShown: ' n\'a pas de problèmes sanguins',
      agree: 'Sanguin',
      sameSlide: false
    },
    {
      label: 'Êtes-vous diabétiques ?',
      formControl: 'diabete',
      agreeShown: ' est diabétique',
      disagreeShown: ' n\'est pas diabétique',
      agree: 'Diabete',
      sameSlide: false
    },
    {
      label: 'Troubles cardiaques ?',
      formControl: 'cardiac',
      agreeShown: ' souffre de troubles cardiaques',
      disagreeShown: 'n\'a pas de troubles cardiaques',
      agree: 'Cardiaque',
      sameSlide: false
    },
  ];

  currentDate: Date = new Date();
  internetBtnEnable = false;
  patientsListBtnEnable = false;
  occlusionEnable = false;
  occlusionField = {
    label: 'Quand vous mangez vos dents s\'emboitent',
    placeholder: 'Sans avis',
    formControl: 'interlockingTeeth',
    suggetions: [
      {
        label: 'Correctement',
        value: 'correctement',
      },
      {
        label: 'Avec peu de contact',
        value: ' avec un peu de contact',
      },
      {
        label: 'vous avez du mal à les emboiter',
        value: 'avoir du mal à les emboiter',
      },
      {
        label: 'Autre',
        value: 'autrement que les choix affichés',
      },
    ]
  };
  aestheticEnable = false;


  aestheticFields = [
    {
      label: 'Du Haut',
      formControl: 'topTeeth',
      multiple: false,
      placeholder: 'Sans avis',
      suggetions: [
        {
          label: 'Trop en avant',
          value: 'Trop en avant',
        },
        {
          label: 'Trop en arriere',
          value: 'Trop en arriere',
        },
        {
          label: 'Chevauchées',
          value: 'chevauchées',
        },
        {
          label: 'Ecartées',
          value: 'sont ecartées du haut ',
        },
        {
          label: 'Me convient',
          value: 'convient',
        },
      ]
    },
    {
      label: 'Du bas',
      formControl: 'bottomTeeth',
      multiple: false,
      placeholder: 'Sans avis',
      suggetions: [
        {
          label: 'Trop en avant',
          value: 'en avant',
        },
        {
          label: 'Trop en arriere',
          value: 'en arriére',
        },
        {
          label: 'Chevauchées',
          value: 'chevauchées',
        },
        {
          label: 'Ecartées',
          value: ' sont ecartées du bas ',
        },
        {
          label: 'Me convient',
          value: 'convient',
        },
      ]
    },
    {
      label: 'Vous voulez',
      formControl: 'patientWish',
      multiple: true,
      placeholder: 'Sans avis',
      suggetions: [
        {
          label: 'Eclaircir vos dents',
          value: ' eclaircir ses dents',
        },
        {
          label: 'Améliorer votre sourire',
          value: ' améliorer son sourire',
        },
        {
          label: 'Autre',
          value: ' autre soins',
        },
      ]
    },
    {
      label: 'Vous trouvez votre sourire',
      formControl: 'patientFind',
      multiple: true,
      placeholder: 'Sans avis',
      suggetions: [
        {
          label: 'Trop étroit',
          value: 'Trop étroit',
        },
        {
          label: 'Trop large',
          value: 'Trop large',
        },
        {
          label: 'Me convient',
          value: 'son sourire lui convient',
        },
      ]
    },
    {
      label: 'Dans votre sourire',
      formControl: 'gum',
      multiple: true,
      placeholder: 'Sans avis',
      suggetions: [
        {
          label: 'On voit trop de gencive',
          value: 'trop de gencive',
        },
        {
          label: 'On ne voit pas assez les dents',
          value: 'pas assez des dents',
        },
        {
          label: 'Me convient',
          value: 'son sourire lui convient',
        },
      ]
    },
    {
      label: 'Trouvez-vous votre visage',
      formControl: 'patientFaceFind',
      multiple: true,
      placeholder: 'Sans avis',
      suggetions: [
        {
          label: 'Trop écrasé',
          value: 'Trop écrasé',
        },
        {
          label: 'Trop grand',
          value: 'Trop grand',
        },
        {
          label: 'Me convient',
          value: 'son visage lui convient',
        }
      ]
    },
  ];
  displayPatient = {
    label: 'Nom de patient',
    titleTemplate: 'Sélectionner le patient',
    index: 5
  };

  /* Forms */
  slide1_Form: FormGroup;
  slide2_Form: FormGroup;
  slide3_Form: FormGroup;
  slide4_Form: FormGroup;
  slide5_Form: FormGroup;
  slide6_Form: FormGroup;
  slide7_Form: FormGroup;
  slide8_Form: FormGroup;
  slide9_Form: FormGroup;
  slide10_Form: FormGroup;
  slide11_Form: FormGroup;
  slideSelectForm: FormGroup;
  isSubmittedSlide1_Form = false;
  isSubmittedSlide2_Form = false;
  isSubmittedSlide3_Form = false;
  isSubmittedSlide4_Form = false;
  isSubmittedSlide5_Form = false;
  isSubmittedSlide6_Form = false;
  isSubmittedSlide7_Form = false;
  isSubmittedSlide8_Form = false;
  isSubmittedSlide9_Form = false;
  isSubmittedSlide10_Form = false;
  isSubmittedSlide11_Form = false;
  isSubmittedSlideSelect_Form = false;
  q1cs: any = {};
  medicalQuestions: any = {};
  pays = [];

  title = 'Fiche patient';
  resumeAttributes: Array<string> = ['infoGenerale', 'esthetique', 'financial', 'qdentaire', 'qmedicalGenerale'];
  infoGenerale = '';
  esthetique = '';
  financial = '';
  qdentaire = '';
  qmedicalGenerale = '';

  dataQ1CS = [
    {
      title: 'Information Général',
      content: null,
    },
    {
      title: 'Niveau esthétique',
      content: null,

    },
    {
      title: 'Niveau financier',
      content: null,
    },
    {
      title: 'Questionnaire Dentaire',
      content: null,
    },
    {
      title: 'Questionnaire Médical Général',
      content: null,
    },
  ];
  q1csExist = false;
  rdvExist = false;


  constructor(
    private alertCtrl: AlertController,
    private toastController: ToastController,
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private documentService: DocumentService,
    private platform: Platform,
    private ionLoaderService: IonLoaderService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private ft: FileTransfer,
    private storage: StorageService,
    private file: File,
    private fileOpener: FileOpener,
    private patientService: PatientService
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.q1csExist = params.q1csExist;
      this.rdvExist = params.rdvExist;
      this.q1csFilled = (params.q1csFilled === 'true') ? true : false;
      console.log('this.params', params);
      console.log('this.this.q1csFilled', this.q1csFilled);
    });
  }

  ionViewDidEnter() {
    //this.slides.lockSwipes(true);
    if (!this.q1csFilled) {
      this.signaturePad.set('minWidth', 2); // set szimek/signature_pad options at runtime
      this.signaturePad.clear();
      this.getAllPays();
    }

  }

  /*  ngAfterViewInit(): void {
     this.signaturePad = new SignaturePad(this.signaturePadElement.nativeElement);
     this.signaturePad.clear();
     this.signaturePad.penColor = 'rgb(56,128,255)';
   } */


  async ngOnInit() {

    this.sliderOptions = { pager: false, autoHeight: true, touchStartPreventDefault: false };
    this.createForm();

    this.storage.getObject('patient_info')
      .then((patient: any) => {
        console.log('🚀~   ~ patient', patient);
        this.patient = patient;

        const { id_personne, per_genre, pers_titre, per_nom,
          per_prenom, per_datnaiss, profession, per_adr1,
          per_cpostal, per_ville, per_email, per_telprinc } = patient;
        this.responseNotFilled = pers_titre + ' ' + per_nom + ' n’a pas fourni de réponse.';
        if (per_genre === 'M') {
          this.pronoun = 'Il';
          this.alias = 'Le patient : ';
        } else {
          this.pronoun = 'Elle';
          this.alias = 'La patiente : ';
        }
        this.slide1_Form.controls.firstName.setValue(per_nom);
        this.slide1_Form.controls.lastName.setValue(per_prenom);
        this.slide1_Form.controls.birthDate.setValue(per_datnaiss);
        this.slide1_Form.controls.address.setValue(per_adr1);
        this.slide1_Form.controls.postalCode.setValue(per_cpostal);
        this.slide1_Form.controls.city.setValue(per_ville);
        this.slide2_Form.controls.email.setValue(per_email);
        this.slide2_Form.controls.email.setValue(per_email);
        this.slide2_Form.controls.tel.setValue(per_telprinc);
        if (this.q1csFilled) {
          this.patientService.getResumePatient(this.patient.id_personne)
            .then(async res => {
              console.log('res', res);
              if (res) {
                for (let i = 0; i < this.resumeAttributes.length; i++)
                  {this.dataQ1CS[i].content = res[this.resumeAttributes[i]];}
              }
            });
        }
      });
    const name: any = await this.storage.getObject('clinic');
    this.folder = `${clinic[name].folder}`;
  }

  goBack() {
    if (this.q1csExist) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/tabs/account']);
    }
  }

  createForm() {
    this.slide1_Form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: ['', Validators.required],
      address: ['', Validators.required],
      postalCode: ['', Validators.required],
      city: ['', Validators.required],
    },
    );

    this.slide2_Form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      tel: ['', Validators.required],
      idPays: ['170',],
      profession: ['', Validators.required],
      knowClinic: ['', Validators.required],
      patientRecommending: [''],
    },
    );


    this.slide3_Form = this.formBuilder.group({
      reasonConsultation: [''],
      smileMark: [''],
      chewingMark: [''],
    },
    );

    this.slide4_Form = this.formBuilder.group({
      // occlusionEnable
      interlockingTeeth: [''],
      //aestheticEnable
      topTeeth: [''],
      bottomTeeth: [''],
      patientWish: [''],
      patientFind: [''],
      patientFaceFind: [''],
      gum: [''],

      gumSmile: [false],
      prepareRehabilitation: [false],
      temporoJoint: [false],
    });

    this.slide5_Form = this.formBuilder.group({
      frontTeeth: [false],
      allTeeth: [false],
      fullTreatment: [false],
      surgery: [false],
    });

    this.slide6_Form = this.formBuilder.group({
      insurance: [''],
      insuranceInCharge: [''],
      treatmentCost: [''],
      treatmentBudget: [''],
    },
    );

    this.slide7_Form = this.formBuilder.group({
      cariesCompleted: [''],
      dentalSensitivities: [''],
      dentalPains: [''],
      GrindsTeeth: [''],
    },
    );

    this.slide8_Form = this.formBuilder.group({
      gumsOnBrushing: [''],
      orthodonticTreatment: [''],
      BreatheByMouth: [''],
      lastDescaling: [''],
    },
    );

    this.slide9_Form = this.formBuilder.group({
      affectionOrl: [''],
      jawPain: [''],
      allergy: [''],
    },
    );

    this.slide10_Form = this.formBuilder.group({
      BloodProblems: [''],
      diabete: [''],
      cardiac: [''],
    },
    );

    this.slide11_Form = this.formBuilder.group({
      viralRisk: [''],
      nervous: [''],
      drugsTaken: [''],
    },
    );

    this.slideSelectForm = this.formBuilder.group({
      attendingDentist: [''],
      praticien: [''],
      orlDoctor: [''],
      osteopath: [''],
      attendingDoctor: [''],
    },
    );
  }

  get slide1() {
    return this.slide1_Form.controls;
  }

  get slide2() {
    return this.slide2_Form.controls;
  }

  get slide3() {
    return this.slide3_Form.controls;
  }

  get slide4() {
    return this.slide4_Form.controls;
  }
  get slide5() {
    return this.slide5_Form.controls;
  }

  get slide6() {
    return this.slide6_Form.controls;
  }

  get slide7() {
    return this.slide7_Form.controls;
  }

  get slide8() {
    return this.slide8_Form.controls;
  }

  get slide9() {
    return this.slide9_Form.controls;
  }
  get slide10() {
    return this.slide10_Form.controls;
  }
  get slide11() {
    return this.slide11_Form.controls;
  }

  get selectForm() {
    return this.slideSelectForm.controls;
  }



  questionsClick(e) {
    switch (e.target.id) {
      case '1':
        this.alertQuestionnaire();
        break;
      case '2':
        this.alertQuestionnaireSecond();
        break;
    }
  }

  getAllPays() {
    this.authService.getAllPays().then((pays: any) => {
      this.pays = pays;
      console.log('pays', pays);
    });
  }


  async alertQuestionnaire() {
    const alert = await this.alertCtrl.create({
      header: 'Pourquoi remplir ce questionnaire ?',
      cssClass: 'custom-alert',
      message: `
      <p>
      Le domaine de l’orthodontie change et évolue, en effet, l’appareillage n’est plus la préoccupation
      de l’orthodontiste, ce qui importe c’est la relation que nous entretenons avec vous ou votre enfant,
      votre satisfaction est la priorité de nos cliniques.
    </p>
    <p>
      Cette relation est souvent gâchée par des actes administratifs chronophages qui nous détourne du patient,
      de sa présence et de l’intérêt de son attente.
      Ce questionnaire est à votre disposition pour faciliter et optimiser la qualité de votre rendez-vous.
    </p>
    <p>
      A l’heure de la numérisation et des changement radicaux de secteur de communication ;
      les lignes fixes ont disparu, remplacées par des téléphones portables qui communiquent par SMS, par whattsapp
      ...etc.
      Les adresses ou les noms utilisés dans les courriers engendrent des erreurs de transcription
      et ou de retranscription, d’où l’importante des emails dans les échanges.
    </p>
    <p>
      Cela vous permettra de transférer directement votre dossier médical, vous donnera accès a votre dossier
      pour que vous puissiez contrôler et juger les résultats.
    </p>
    <p>
      Ce questionnaire a pour but de vous permettre d’y revenir, de mieux définir vos attentes,
      de poser toutes les questions, de lever toutes les inquiétudes pour que la clinique B And Smile
      puisse mieux vous comprendre.
    </p>`,
      buttons: [
        {
          text: 'ok',
          handler: async (data) => {

          }
        }
      ]
    });
    await alert.present();
  }

  async alertQuestionnaireSecond() {
    const alert = await this.alertCtrl.create({
      header: 'Peur du dentiste de l’Orthodontiste?',
      cssClass: 'custom-alert',
      message: `
      <p>
          Si OUI
        </p>
        <p>
          La peur du Dentiste, La peur de l’orthodontiste !
        </p>

        <p>
          Certains pensent que c’est une fable ou une faiblesse? Chez B And Smile nous pensons qu’il faut du courage et
          des efforts pour franchir la porte de nos cliniques, pour prendre rendez-vous, que va-t-il se passer? Vais-je
          avoir mal? Vais-je être jugée sur mon état de santé ou mes finances? Vais-je avoir peur?
        </p>

        <p>
          Notre chaine Youtube dédiée au cabinet b And Smile est là pour démystifier toutes ces craintes ou hésitations.
        </p>

        <p>
          La chaine scientifique et le site de l’ISFESO sont là pour vous rassurer sur nos concepts, notre philosophie,
          nos choix d’appareillage, les conditions et moyens que nous mettons à disposition pour votre traitement
          d’orthodontie.
        </p>

        <p>
          Si vous aussi vous avez peur des dentistes, nous vous invitons à commencer par prendre contact gratuitement
          avec nos cliniques ou notre clinique virtuelle qui sont à votre disposition afin de faire le premier pas.
        </p>`,
      buttons: [
        {
          text: 'ok',
          handler: async (data) => {

          }
        }
      ]
    });
    await alert.present();
  }


  clickRadioBtn(e) {
    switch (e.target.id) {
      case '1':
        this.btnWithoutChildren();
        break;
      case '2':
        this.internetRadioBtn();
        break;
      case '3':
        this.btnWithoutChildren();
        break;
      case '4':
        this.btnWithoutChildren();
        break;
      case '5':
        this.patientsList();
        break;
    }
  }

  internetRadioBtn() {
    this.patientsListBtnEnable = false;
    this.internetBtnEnable = true;

  }
  btnWithoutChildren() {
    this.internetBtnEnable = false;
    this.patientsListBtnEnable = false;
  }
  patientsList() {
    this.internetBtnEnable = false;
    this.patientsListBtnEnable = true;
    this.slide2_Form.patchValue({ patient: '' });
  }


  selectRadioOcculation(item: any) {
    console.log('item occlution', item);
    this.slide4_Form.patchValue({ interlockingTeeth: item });
  }


  selectRadioAesthetic(formControl: any, item: any) {

    switch (formControl) {
      case 'topTeeth':
        this.slide4_Form.patchValue({ topTeeth: item });
        break;
      case 'bottomTeeth':
        this.slide4_Form.patchValue({ bottomTeeth: item });
        break;
      case 'gum':
        this.slide4_Form.patchValue({ gum: item });
        break;
      case 'patientFaceFind':
        this.slide4_Form.patchValue({ patientFaceFind: item });
        break;
      case 'patientFind':
        this.slide4_Form.patchValue({ patientFind: item });
        break;
      case 'patientWish':
        this.slide4_Form.patchValue({ patientWish: item });
        break;
    }
  }

  onCheckSlide(slideNumber: number, i: number) {
    switch (slideNumber) {
      case 4:
        this.checkFieldsSlide4[i].checked = !this.checkFieldsSlide4[i].checked;
        break;
      case 5:
        this.wishes[i].checked = !this.wishes[i].checked;
        break;
    }
  }



  next() {
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
  }

  prev() {
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
    this.slides.lockSwipes(true);
  }

  backToHome() {
    if (this.q1csExist) {
      this.router.navigate(['/preliminary'], { queryParams: { q1csExist: this.q1csExist, rdvExist: this.rdvExist } });
    } else {
      this.router.navigate(['/tabs/home']);
    }
  }

  openURL(url: string) {
    window.open(url, '_system', 'location=no');
  }

  onSubmitSlide1_Form() {
    this.isSubmittedSlide1_Form = true;
    if (!this.slide1_Form.valid) {
      return false;
    } else {
      this.next();
    }
  }

  onSubmitSlide2_Form() {
    this.isSubmittedSlide2_Form = true;
    console.log('this.slide2_Form', this.slide2_Form.value);
    if (!this.slide2_Form.valid) {
      return false;
    } else {
      this.next();
    }
  }


  onSubmitSlide3_Form() {
    this.isSubmittedSlide3_Form = true;
    if (!this.slide3_Form.valid) {
      console.log('Please provide all the required values!');
      return false;
    } else {
      console.log('this.slide3_Form.value', this.slide3_Form.value);
      this.next();
    }
  }


  onSubmitSlide4_Form() {

    if (!this.checkFieldsSlide4[0].checked) {
      this.slide4_Form.patchValue({ interlockingTeeth: '' });
    }

    if (!this.checkFieldsSlide4[1].checked) {
      this.slide4_Form.patchValue({ topTeeth: '' });
      this.slide4_Form.patchValue({ bottomTeeth: '' });
      this.slide4_Form.patchValue({ gum: '' });
      this.slide4_Form.patchValue({ patientFaceFind: '' });
      this.slide4_Form.patchValue({ patientFind: '' });
      this.slide4_Form.patchValue({ patientWish: '' });
    }

    for (const field of this.checkFieldsSlide4) {
      if (field.checked && field.formControl) {
        this.slide4_Form.controls[field.formControl].setValue(field.value);
      }
    }

    console.log('this.slide4_Form.value', this.slide4_Form.value);
    this.next();
  }


  onSubmitSlide5_Form() {

    for (const field of this.wishes) {
      if (field.checked && field.formControl) {
        this.slide5_Form.controls[field.formControl].setValue(field.value);
      }
    }

    console.log('this.slide5_Form.value', this.slide5_Form.value);
    this.next();
  }

  onSubmitSlide6_Form() {
    console.log('this.slide6_Form.value', this.slide6_Form.value);
    this.next();
  }

  onSubmitMedicalForm() {
    console.log('this.slideSelectForm.value', this.slideSelectForm.value);
    this.next();
  }

  onSubmitSlide7_Form() {
    console.log('this.slide7_Form.value', this.slide7_Form.value);
    this.next();
  }


  onSubmitSlide8_Form() {

    console.log('this.slide8_Form.value', this.slide8_Form.value);
    this.next();
  }


  onSubmitSlide9_Form() {
    console.log('this.slide9_Form.value', this.slide9_Form.value);
    this.next();
  }

  onSubmitSlide10_Form() {
    console.log('this.slide10_Form.value', this.slide10_Form.value);
    this.next();
  }

  onSubmitSlide11_Form() {
    console.log('this.slide11_Form.value', this.slide11_Form.value);

    this.q1cs = {
      ...this.q1cs,
      ...this.slide1_Form.value,
      ...this.slide2_Form.value,
      ...this.slide3_Form.value,
      ...this.slide4_Form.value,
      ...this.slide5_Form.value,
      ...this.slide6_Form.value,
      ...this.slideSelectForm.value,
      ...this.slide7_Form.value,
      ...this.slide8_Form.value,
      ...this.slide9_Form.value,
      ...this.slide10_Form.value,
      ...this.slide11_Form.value,
      ...this.slideSelectForm.value
    };
    console.log(' this.q1cs', this.q1cs);
    /*
    this.generateAbstractDentalQuestUser(this.q1cs);
    this.generateAnotherAbstractDentalUser(this.q1cs);
    this.generateAbstractMedicalUser(this.q1cs); */
    this.generateGeneralInformation(this.q1cs);
    this.generateAestheticInformation(this.q1cs);
    this.generateFinancialInformation(this.q1cs);
    this.generateSelectableToGeneralInformation(this.q1cs);
    this.generateDentaireInformation(this.q1cs);
    this.generateGeneralMedicalInformation(this.q1cs);
    this.fillDataQ1CS();
    this.next();
  }



  fillDataQ1CS() {
    this.dataQ1CS[0].content = this.infoGenerale;
    this.dataQ1CS[1].content = this.esthetique;
    this.dataQ1CS[2].content = this.financial;
    this.dataQ1CS[3].content = this.qdentaire;
    this.dataQ1CS[4].content = this.qmedicalGenerale;
  }

  getFinalSlide() {
    this.next();
  }

  generateGeneralInformation(formQ1CS: any) {
    const { firstName, lastName, birthDate, address, postalCode, city, email, idCountry, tel,
      job, knowClinic, reasonConsultation, smileMark, chewingMark } = formQ1CS;

    const today = new Date();
    const year = today.getFullYear();

    this.infoGenerale = this.alias + firstName + ' ' + lastName;
    this.infoGenerale += '\n Agé(e) de ' + (year - parseInt(birthDate.substring(0, 4))) + ' ans';
    this.infoGenerale += '\n Habite à  ' + address + ' ,de code postal ' + postalCode + ', ' + city;
    /* ////contact address
    let contact: Contact = this.generateContact(20, this.patient.id_personne, null, postalCode, 4, null, address + "  " + postalCode + " " + city, city, 0, address);
    this.lstContact.push(contact);
    ////contact email
    contact = this.generateContact(7, this.patient.id_personne, null, null, 2, null, email, null, 0, null);
    this.lstContact.push(contact);
    ////contact tél
    let pays: Pays = this.listOfCountries.find(p => p.id_pays == idCountry);
    const { id_pays, indicatif_telephonique } = pays;
    contact = this.generateContact(1, this.patient.id_personne, id_pays, null, 1, indicatif_telephonique, tel, null, 1, null);
    this.lstContact.push(contact); */

    this.infoGenerale += !job ? '' : '\n' + this.pronoun + ' travaille comme ' + job;
    let knowClinicBy: string;
    if (knowClinic) {
      knowClinicBy = knowClinic;
      /* if (patientRecommending) {
        knowClinicBy = knowClinic + " appelé : " + per_nom + " " + per_prenom;
       } */
      this.infoGenerale += '\n' + this.pronoun + ' a connu la clinique par  : ' + knowClinicBy;
    }
    this.infoGenerale += !reasonConsultation ? '' : '\nSon motif de consultation est  : (' + reasonConsultation + ')';
    this.infoGenerale += !smileMark ? '' : '\nNote attribuée à son sourire : ' + smileMark;
    this.infoGenerale += !chewingMark ? '' : '\nNote attribuée à la mastication : ' + chewingMark;

  }

  generateAestheticInformation(formQ1CS: any) {

    this.esthetique = '';
    const { interlockingTeeth, topTeeth, bottomTeeth,
      patientWish, patientFind, patientFaceFind, gum,
      gumSmile, prepareRehabilitation, temporoJoint,
      frontTeeth, allTeeth, fullTreatment, surgery } = formQ1CS;

    if (interlockingTeeth) {
      this.infoGenerale += '\nSes dents s’emboitent : ' + interlockingTeeth;
    } else {
      this.infoGenerale += '\n' + this.pronoun + ' n\' pas indiqué comment ses dents s’emboitent ';
    }
    if (topTeeth) {
      if (topTeeth == 'convient')
        {this.esthetique += 'Ses dents du haut lui convient';}
      else
        {this.esthetique += '\n' + this.pronoun + ' trouve ses dents du haut : ' + topTeeth;}
    }
    if (bottomTeeth) {
      if (bottomTeeth == 'convient')
        {this.esthetique += '\n Ses dents du bas lui convient';}
      else
        {this.esthetique += '\n Ses dents du bas : ' + bottomTeeth;}
    }
    this.esthetique += !patientWish ? '' : '\n' + this.pronoun + ' veut :' + patientWish;
    this.esthetique += !patientFind ? '' : '\n' + this.alias + 'trouve son sourire : ' + patientFind;
    this.esthetique += !patientFaceFind ? '' : '\n' + this.alias + ' trouve son visage ' + patientFaceFind;
    this.esthetique += !gum ? '' : '\n' + this.alias + 'Dans votre sourire ' + gum;
    this.esthetique += !gumSmile ? '' : '\n' + this.pronoun + ' veut : ' + gumSmile;
    this.esthetique += !prepareRehabilitation ? '' : '\n' + this.pronoun + ' veut : ' + prepareRehabilitation;
    this.esthetique += !temporoJoint ? '' : '\n' + this.pronoun + ' veut : ' + temporoJoint;
    this.esthetique += !frontTeeth ? '' : '\n' + this.pronoun + ' veut : ' + frontTeeth;
    this.esthetique += !allTeeth ? '' : '\n' + this.pronoun + ' veut : ' + allTeeth;
    this.esthetique += !fullTreatment ? '' : '\n' + this.pronoun + ' veut : ' + fullTreatment;
    this.esthetique += !surgery ? '' : '\n' + this.pronoun + ' veut : ' + surgery;

    if (!this.esthetique.match('[A-Za-z]')) {
      this.esthetique = '\n' + this.alias + 'n\' a pas déclaré aucune information';
    }
  }

  generateFinancialInformation(formQ1CS: any) {
    this.financial = '';
    const { insurance, insuranceInCharge, treatmentCost, treatmentBudget } = formQ1CS;
    this.financial += (!insurance || insurance === 'non') ? '\n' + this.pronoun + ' n’est pas assuré.' : this.pronoun + ' a une assurance dentaire ';
    this.financial += !treatmentCost ? '\n' + this.pronoun + ' n\'a pas estimé le coût du traitement '
      : '\n' + this.pronoun + ' estime comme coût du traitement : ' + treatmentCost;
    this.financial += !treatmentBudget ? '\n' + this.pronoun + ' n\'a pas prévu de budget  '
      : '\n' + this.pronoun + ' a prévu comme budget  ' + treatmentBudget;
    if (!this.financial.match('[A-Za-z]')) {
      this.financial = '\n' + this.alias + 'n\' a pas déclaré aucune information';
    }
  }

  generateSelectableToGeneralInformation(formQ1CS: any) {
    const { attendingDentist,
      praticien, osteopath, orlDoctor, attendingDoctor } = formQ1CS;
    if (attendingDentist || praticien || osteopath ||
      orlDoctor || attendingDoctor)
      {this.infoGenerale += '\n' + this.pronoun + ' a été adressé par :';}
    if (attendingDentist) {this.infoGenerale += ' Le dentiste : ' + attendingDentist;}
    if (praticien) {this.infoGenerale += ' Le praticien : ' + praticien;}
    if (osteopath) {this.infoGenerale += ' L’ostéopathe  : ' + osteopath;}
    if (orlDoctor) {this.infoGenerale += ' L’ORL : ' + orlDoctor;}
    if (attendingDoctor) {this.infoGenerale += ' Le médecin traitant : ' + attendingDoctor;}

  }

  generateDentaireInformation(formQ1CS: any) {
    this.qdentaire = '';
    const { cariesCompleted, lastDescaling, gumsOnBrushing,
      dentalSensitivities, dentalPains, GrindsTeeth, orthodonticTreatment,
      BreatheByMouth, affectionOrl, jawPain, allergy } = formQ1CS;
    this.qdentaire += this.getPatientResponse(cariesCompleted, this.yesNoDentalQuestions, 0);
    this.qdentaire += this.getPatientResponse(dentalSensitivities, this.yesNoDentalQuestions, 1, this.pronoun);
    this.qdentaire += this.getPatientResponse(dentalPains, this.yesNoDentalQuestions, 2, this.pronoun);

    this.qdentaire += this.getPatientResponse(GrindsTeeth, this.yesNoDentalQuestions, 3, this.pronoun);
    this.qdentaire += this.getPatientResponse(gumsOnBrushing, this.yesNoDentalQuestions, 4);
    this.qdentaire += this.getPatientResponse(orthodonticTreatment, this.yesNoDentalQuestions, 5, this.pronoun);

    if (lastDescaling) {
      if (lastDescaling === 'plus') {this.qdentaire +=
        '\n' + 'Son dernier détartrage a été effectué il y a plus que 2 ans ';}
      else {this.qdentaire += '\n' +
        'Son dernier détartrage a été effectué il y a  ' + lastDescaling;}
    }
    else {
      this.qdentaire += '\n' + '( Date de votre dernier détartrage ? ) : ' + this.responseNotFilled;
    }
    // questionnaire dentaire (part 2)
    this.qdentaire += this.getPatientResponse(BreatheByMouth, this.yesNoGeneralMedicalQuestions, 0, this.pronoun);
    this.qdentaire += this.getPatientResponse(affectionOrl, this.yesNoGeneralMedicalQuestions, 1, this.pronoun);
    this.qdentaire += this.getPatientResponse(jawPain, this.yesNoGeneralMedicalQuestions, 2);
    this.qdentaire += this.getPatientResponse(allergy, this.yesNoGeneralMedicalQuestions, 3, this.pronoun);

    if (!this.qdentaire.match('[A-Za-z]')) {
      this.qdentaire = this.pronoun + ' n\'a répondu à aucune des questions dentaires';
    }
  }

  generateGeneralMedicalInformation(formQ1CS: any) {
    this.qmedicalGenerale = '';
    const { viralRisk, nervous, BloodProblems, diabete, cardiac, drugsTaken, medicament } = formQ1CS;
    this.qmedicalGenerale += !viralRisk ? '\n' + this.pronoun + ' n\'a mentionné auncun risque viral' :
      '\n' + this.pronoun + ' a  risque viral';
    this.qmedicalGenerale += !nervous ? '' : '\n' + this.pronoun + ' souffre de : ' + nervous.toLowerCase();
    this.qmedicalGenerale += this.getPatientResponse(BloodProblems, this.yesNoGeneralMedicalQuestions, 4, this.pronoun);
    this.qmedicalGenerale += this.getPatientResponse(diabete, this.yesNoGeneralMedicalQuestions, 5, this.pronoun);
    this.qmedicalGenerale += this.getPatientResponse(cardiac, this.yesNoGeneralMedicalQuestions, 6, this.pronoun);
    this.qmedicalGenerale += !drugsTaken ? '\n' + this.pronoun + ' n\'utilise pas de médicaments'
      : '\n' + this.pronoun + ' utilise les médicaments suivants  :' + drugsTaken;
    if (!this.qmedicalGenerale.match('[A-Za-z]')) {
      this.qmedicalGenerale = this.pronoun + ' n\'a répondu à aucune des questions au niveau médical général';
    }
  }

  getPatientResponse(formControl: any, container: any, index: number, pronoun?: string) {
    if (formControl) {
      if (formControl == 'Non')
        {if (pronoun)
          {return '\nNon, ' + pronoun + container[index].disagreeShown;}
        else
          {return '\n' + container[index].disagreeShown;}}
      else
        if (pronoun)
          {return '\nOui, ' + pronoun + container[index].agreeShown;}
        else
          {return '\n' + container[index].agreeShown;}
    } else
      {return '\n (' + container[index].label + ' ) : ' + this.responseNotFilled;}
  }




  generateAbstractMedicalUser(infoUser: any) {
    this.dataQ1CS[4].content += (!infoUser.viralRisk) ? this.pronoun + ' n\'a mentionné auncun risque viral' :
      + '\n' + this.pronoun + ' a  ' + infoUser.viralRisk.toLowerCase();
    this.dataQ1CS[4].content += (!infoUser.nervous) ? ' ' : + '\n' + this.pronoun + ' souffre de : ' + infoUser.nervous.toLowerCase();
    this.dataQ1CS[4].content += + '\n' + 'Problèmes sanguins ( hémophilie, sang clair, anémie..) ?' + '\n' + this.getPatientResponse(infoUser.BloodProblems, this.yesNoGeneralMedicalQuestions, 4, this.pronoun);
    this.dataQ1CS[4].content += + '\n' + 'Êtes-vous diabétiques ?' + '\n' + this.getPatientResponse(infoUser.diabete, this.yesNoGeneralMedicalQuestions, 5, this.pronoun);
    this.dataQ1CS[4].content += + '\n' + 'Troubles cardiaques ?' + '\n' + this.getPatientResponse(infoUser.cardiac, this.yesNoGeneralMedicalQuestions, 6, this.pronoun);
    if (infoUser.drugsTaken) {
      this.dataQ1CS[3].content += (!infoUser.medicament) ? this.pronoun + ' n\'utilise pas de médicaments'
        : + '\n' + this.pronoun + ' utilise les médicaments suivants  :' + infoUser.drugsTaken;
    }
    if (!this.dataQ1CS[4].content.match('[A-Za-z]')) {
      this.dataQ1CS[3].content = this.pronoun + ' n\'a répondu à aucune des questions au niveau médical général';
    }
  }


  async getUserBySerach(medical: any) {
    console.log('medical', medical);
    const modal = await this.modalCtrl.create({
      component: SearchComponent,
      mode: 'ios',
      componentProps: {
        id: medical.id,
        title: medical.titleTemplate,
      },
    });

    modal.onDidDismiss().then((res: any) => {
      console.log('res', res);
      if (res.data) {
        switch (res.data.medicalId) {
          case 'attendingDentist':
            this.slideSelectForm.reset();
            this.slideSelectForm.patchValue({ attendingDentist: `${res.data.per_nom} ${res.data.per_prenom}` });
            break;
          case 'praticien':
            this.slideSelectForm.reset();
            this.slideSelectForm.patchValue({ praticien: `${res.data.per_nom} ${res.data.per_prenom}` });
            break;
          case 'orl':
            this.slideSelectForm.reset();
            this.slideSelectForm.patchValue({ orlDoctor: `${res.data.per_nom} ${res.data.per_prenom}` });
            break;
          case 'ostepathMedecin':
            this.slideSelectForm.reset();
            this.slideSelectForm.patchValue({ osteopath: `${res.data.per_nom} ${res.data.per_prenom}` });
            break;
          case 'medecinTraitH':
            this.slideSelectForm.reset();
            this.slideSelectForm.patchValue({ attendingDoctor: `${res.data.per_nom} ${res.data.per_prenom}` });
            break;
          case 'patientRecommending':
            this.slide2_Form.patchValue({ patientRecommending: `${res.data.per_nom} ${res.data.per_prenom}` });
            break;
        }
      }
    });
    return await modal.present();

  }



  async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }


  clean() {
    this.signaturePad.clear();
  }

  generateSignature() {
    this.pathImageSignature = this.signaturePad.toDataURL();
  }

  async createPdf() {
    const docDefinition = {
      content: [
        {
          image: await this.getBase64ImageFromURL('assets/imgs/LOGO-B-And-Smile-gris-01.png'),
          width: 150,
          alignment: 'left'
        },
        { text: 'Anamnèse ', style: 'subheader' },
        { text: this.infoGenerale, },
        { text: 'Niveau esthétique', style: 'subheader' },
        { text: this.esthetique, },
        { text: 'Niveau financier ', style: 'subheader' },
        { text: this.financial, },
        { text: 'Questionnaire dentaire', style: 'subheader' },
        { text: this.qdentaire, },
        { text: 'Questionnaire médical général ', style: 'subheader' },
        { text: this.qmedicalGenerale, },
        { text: 'Signature du Patient :', style: 'lastSubheader' },
        { image: (this.pathImageSignature), style: 'img', fit: [80, 50] },
      ],
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          alignment: 'center',
        },
        subheader: {
          fontSize: 12,
          bold: true,
          margin: [0, 15, 0, 0],
          // decoration : 'underline',
          color: 'red',
          alignment: 'center',
        },
        grandLigne: {
          fontSize: 16,
          bold: true,
          margin: [0, 15, 0, 0],
          italic: true,
          decoration: 'underline',
        },
        story: {
          italic: true,
          alignment: 'center',
          width: '50%',
        },
        lastSubheader: {
          fontSize: 12,
          bold: true,
          margin: [0, 0, 0, 0],
          color: 'red',
          alignment: 'right',
        },
        img: {
          alignment: 'right',
        }
      }
    };
    this.pdfObj = pdfMake.createPdf(docDefinition);
    console.log('this.q1cs', this.q1cs);
    this.updatePersonne(this.q1cs);
    this.insertQMedical(this.patient.id_personne, this.q1cs);
    console.log('this.insertQMedical', this.patient.id_personne);

    this.insertResume(this.patient.id_personne);
    console.log('this.insertResume', this.patient.id_personne);


    this.savePdf().then(() => {
      this.router.navigate(['/tabs/home']);
    });
  }


  getBase64ImageFromURL(url: string) {

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const dataURL = canvas.toDataURL('image/png');

        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = url;
    });
  }



  async savePdf() {
    await this.createDossierPatient(this.folder + '/' + this.patient.id_personne);
    if (this.platform.is('cordova')) {
      this.pdfObj.getBuffer((buffer) => {
        this.blob = new Blob([buffer], { type: 'application/pdf' });
        this.file.writeFile(this.file.dataDirectory, 'Questionnaire Médical.pdf', this.blob, { replace: true }).then(fileEntry => {
          this.fileOpener.open(fileEntry.nativeURL, 'application/pdf').then(() =>
            console.log('File is opened'))
            .catch(e => console.log('Error opening file', e));
        });
      });
    } else {
      this.pdfObj.download();
    }

    await this.pdfObj.getBase64(async (result: any) => {

      const destName = sha1(result);
      //let img64: any = await this.reduce_image_file_size(result);
      const img64: any = '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';
      const raw = window.atob(result.toString());
      const vignette = window.btoa(raw);

      const n = raw.length;
      const a = new Uint8Array(new ArrayBuffer(n));

      for (let i = 0; i < n; i++) {
        a[i] = raw.charCodeAt(i);
      }
      const blob = new Blob([a], { type: 'application/pdf' });
      const form = new FormData();
      form.append('file', blob);
      const payload: any = {};
      payload.pkObjet = 0;
      payload.nom = destName;
      payload.extension = 'PDF';
      payload.id_patient = this.patient.id_personne;
      payload.vignette = vignette;
      payload.width = 0;
      payload.height = 0;
      payload.taille = 0;
      payload.estidentite = 0;
      payload.dateCreation = null;
      payload.lastModif = null;
      payload.echelle = 1;
      payload.fichier = destName + '.PDF';
      payload.repStockage = `${this.folder}/${this.patient.id_personne}`;
      payload.syncPath = '';
      payload.dateInsertion = null;
      payload.auteur = null;
      payload.id_patient_orthalis = this.patient.id_personne;
      payload.idGabarit = 0;
      console.log('this.payload', payload);

      this.ionLoaderService.startLoader();



      this.documentService.addObjet(payload)
        .then((res: any) => {
          console.log('documentService#res', res);
          this.documentService.sendImage(payload.fichier, payload.repStockage, form)
            .then((data: any) => {
              console.log('documentService#data', data);
              this.ionLoaderService.stopLoader();
            },
              (error: Error) => {
                console.log('error', error);
                this.ionLoaderService.stopLoader();
              });
        },
          (error: Error) => {
            this.ionLoaderService.stopLoader();
            console.log('error', error);
          });

      // this.sendPayloadImage(payload);



    });
  }



  async createDossierPatient(path: string) {
    this.documentService.createDossierPatient(path).then(data => {
      console.log('createDossierPatient#data', data);
    }, error => {
      console.log('createDossierPatient#error', error);
    });
  }

  async reduce_image_file_size(base64Str: string, MAX_WIDTH = 370, MAX_HEIGHT = 200) {
    const resized_base64 = await new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL()); // this will return base64 image results after resize
      };
    });
    return resized_base64;


  }

  insertResume(id_personne: number) {
    const resumeObject: any = {
      id_personne,
      infoGenerale: this.infoGenerale,
      esthetique: this.esthetique,
      financial: this.financial,
      qdentaire: this.qdentaire,
      qmedicalGenerale: this.qmedicalGenerale,
    };

    return this.patientService.addResume(resumeObject);
  }


  insertQMedical(id_personne: number, form: any) {
    console.log('id_personne', id_personne);
    const qMedicalPersonne: any = {
      id_personne,
      sensibiliteDentaire: form.dentalSensitivities,
      GrinceDent: form.GrindsTeeth,
      douleurDentaire: form.dentalPains,
      traitOrtho: form.orthodonticTreatment,
      respireBouche: form.BreatheByMouth,
      affectionOrl: form.affectionOrl,
      douleurMachoire: form.jawPain,
      reactionAllergique: form.allergy,
      risqueViral: form.viralRisk,
      nerveaux: form.nervous,
      sanguin: form.BloodProblems,
      diabete: form.diabete,
      cardiaque: form.cardiac,
      traitementMedicament: form.drugsTaken,
      rdvTraitement: form.rdvTraitement,
      resultPlanif: form.resultPlanif,
      confiance: form.confiance,
      noteSourire: form.smileMark,
      noteMastication: form.chewingMark,
      connuClinique: form.knowClinic,
      patientToSendMail: form.patientRecommendingName,
      motif: form.reasonConsultation,
      oclusionVal: form.interlockingTeeth,
      esthetiqueListDuHautVal: form.topTeeth,
      esthetiqueListDuBasVal: form.bottomTeeth,
      vousVoulez: form.youwant,
      trouvezVous: form.youFind,
      visageTrouvez: form.youFindFace,
      genciveTrouver: form.gum,
      gingivalValueTo: form.gumSmile,
      rehabilationTo: form.prepareRehabilitation,
      articulationTo: form.temporoJoint,
      dentAvantTo: form.frontTeeth,
      dentAlignTo: form.allTeeth,
      traitmCompletTo: form.fullTreatment,
      chrirgieNecTo: form.surgery,
      assuranceTo: form.insurance,
      assuranceChargeTo: form.insuranceInCharge,
      coutTraitmantTo: form.treatmentCost,
      budgetTraitmantTo: form.treatmentBudget,
      dentistTraitantNom: form.attendingDentistName,
      praticienNom: form.praticienName,
      ostepathNom: form.osteopathName,
      orlMedNom: form.orlDoctorName,
      medecinTraitNom: form.attendingDoctorName,
      curesTermineTo: form.cariesCompleted,
      dernierDetartage: form.lastDescaling,
      genciveBrossage: form.gumsOnBrushing,
    };

    console.log('qMedicalPersonne#data', qMedicalPersonne);

    return this.patientService.addQMedical(qMedicalPersonne);

  }

  updatePersonne(form) {
    const birthDateToDB = form.birthDate.replace(' ', 'T');
    const personObj: any = {
      per_nom: form.firstName,
      per_prenom: form.firstName,
      per_email: form.firstName,
      per_ville: form.firstName,
      profession: form.firstName,
      per_adr1: form.firstName,
      per_cpostal: form.firstName,
      per_telprinc: form.firstName,
      per_datnaiss: birthDateToDB,
    };
    return this.userService.updatePersonneQ(personObj, this.patient.id_personne);
  }

}

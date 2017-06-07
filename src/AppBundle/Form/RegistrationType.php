<?php
namespace AppBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\FormBuilderInterface;

use Symfony\Component\Form\Extension\Core\Type\SubmitType;

class RegistrationType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('description',TextareaType::class,array(
                'label' => 'Description',
                'attr' => array(
                    "class" => "input-form"
                )
            ))
            ->add('save', SubmitType::class, array(
                'label' => 'Mettre à jour mon profile',
                'attr' => array(
                    'class' => 'btn btn-success'
                )
            ));
    }

    public function getParent()
    {
        return 'FOS\UserBundle\Form\Type\RegistrationFormType';
    }

    public function getBlockPrefix()
    {
        return 'app_user_registration';
    }
}